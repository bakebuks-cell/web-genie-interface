/**
 * Backend streaming speech transcription service.
 *
 * Captures microphone audio via MediaRecorder, streams chunks to a
 * WebSocket endpoint (e.g. faster-whisper backend), and returns
 * interim/final transcripts in near real-time.
 *
 * The WebSocket URL is configurable — defaults to api.mycodex.dev.
 */

// ── Configuration ──────────────────────────────────────────────
const DEFAULT_WS_URL = "wss://api.mycodex.dev/ws/transcribe";

export interface TranscriptionConfig {
  wsUrl?: string;
  /** Silence timeout in ms before auto-stop (default 3000) */
  silenceTimeout?: number;
  /** Audio chunk interval in ms (default 250) */
  chunkInterval?: number;
  onInterim?: (text: string) => void;
  onFinal?: (text: string) => void;
  onError?: (msg: string) => void;
  onStatusChange?: (status: "connecting" | "listening" | "stopped") => void;
}

interface TranscriptionSession {
  stop: () => void;
}

// ── Public API ─────────────────────────────────────────────────

export async function startTranscription(
  config: TranscriptionConfig
): Promise<TranscriptionSession> {
  const wsUrl = config.wsUrl || DEFAULT_WS_URL;
  const silenceTimeout = config.silenceTimeout ?? 3000;
  const chunkInterval = config.chunkInterval ?? 250;

  let stopped = false;
  let mediaRecorder: MediaRecorder | null = null;
  let ws: WebSocket | null = null;
  let stream: MediaStream | null = null;
  let silenceTimer: ReturnType<typeof setTimeout> | null = null;
  let accumulatedFinal = "";

  const cleanup = () => {
    stopped = true;
    if (silenceTimer) clearTimeout(silenceTimer);
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try { mediaRecorder.stop(); } catch {}
    }
    if (ws && ws.readyState <= WebSocket.OPEN) {
      try { ws.close(); } catch {}
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    config.onStatusChange?.("stopped");
    console.log("[STT-Backend] session stopped");
  };

  const resetSilenceTimer = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (stopped) return;
    silenceTimer = setTimeout(() => {
      console.log("[STT-Backend] silence timeout — finalizing");
      // Send stop signal to backend
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "stop" }));
      }
      // Short grace period then cleanup
      setTimeout(cleanup, 500);
    }, silenceTimeout);
  };

  // ── 1. Get microphone access ──
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 16000,
      },
    });
  } catch (err) {
    console.error("[STT-Backend] mic access denied:", err);
    config.onError?.("Microphone access denied. Please allow microphone permissions.");
    config.onStatusChange?.("stopped");
    return { stop: () => {} };
  }

  config.onStatusChange?.("connecting");
  console.log("[STT-Backend] connecting to", wsUrl);

  // ── 2. Open WebSocket ──
  try {
    ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";
  } catch (err) {
    console.error("[STT-Backend] WebSocket creation failed:", err);
    config.onError?.("Could not connect to transcription server.");
    stream.getTracks().forEach((t) => t.stop());
    config.onStatusChange?.("stopped");
    return { stop: () => {} };
  }

  ws.onopen = () => {
    if (stopped) return;
    console.log("[STT-Backend] WebSocket connected");
    config.onStatusChange?.("listening");
    resetSilenceTimer();
    startRecording();
  };

  ws.onmessage = (event) => {
    if (stopped) return;
    try {
      const msg = JSON.parse(event.data as string);
      console.log("[STT-Backend] message:", msg);

      if (msg.type === "interim" && msg.text) {
        resetSilenceTimer();
        config.onInterim?.(accumulatedFinal + (accumulatedFinal ? " " : "") + msg.text);
      } else if (msg.type === "final" && msg.text) {
        resetSilenceTimer();
        accumulatedFinal = accumulatedFinal
          ? accumulatedFinal + " " + msg.text
          : msg.text;
        config.onFinal?.(accumulatedFinal);
        console.log("[STT-Backend] final accumulated:", accumulatedFinal);
      } else if (msg.type === "error") {
        config.onError?.(msg.message || "Transcription error");
      }
    } catch {
      console.warn("[STT-Backend] unparseable message:", event.data);
    }
  };

  ws.onerror = (err) => {
    console.error("[STT-Backend] WebSocket error:", err);
    if (!stopped) {
      config.onError?.("Could not recognize voice clearly. Please try again.");
      cleanup();
    }
  };

  ws.onclose = () => {
    console.log("[STT-Backend] WebSocket closed");
    if (!stopped) {
      // If the server closed first, finalize what we have
      if (accumulatedFinal) {
        config.onFinal?.(accumulatedFinal);
      }
      cleanup();
    }
  };

  // ── 3. MediaRecorder — stream audio chunks ──
  function startRecording() {
    if (stopped || !stream) return;

    // Prefer webm/opus, fall back to whatever is available
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";

    mediaRecorder = new MediaRecorder(stream, {
      ...(mimeType ? { mimeType } : {}),
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(event.data);
      }
    };

    mediaRecorder.onerror = () => {
      console.error("[STT-Backend] MediaRecorder error");
      config.onError?.("Audio recording error.");
      cleanup();
    };

    mediaRecorder.start(chunkInterval);
    console.log("[STT-Backend] recording started, chunk interval:", chunkInterval, "ms");
  }

  return { stop: cleanup };
}
