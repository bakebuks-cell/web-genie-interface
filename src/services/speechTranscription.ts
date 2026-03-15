/**
 * Speech transcription service with automatic fallback.
 *
 * Strategy:
 * 1. Try backend WebSocket (faster-whisper) for best accuracy
 * 2. If WebSocket fails to connect within 3s, fall back to browser Web Speech API
 *
 * Both paths expose the same callback interface.
 */

const DEFAULT_WS_URL = "wss://api.mycodex.dev/ws/transcribe";
const WS_CONNECT_TIMEOUT_MS = 3000;

export interface TranscriptionConfig {
  wsUrl?: string;
  silenceTimeout?: number;
  chunkInterval?: number;
  onInterim?: (text: string) => void;
  onFinal?: (text: string) => void;
  onError?: (msg: string) => void;
  onStatusChange?: (status: "connecting" | "listening" | "stopped") => void;
  onDebugStatus?: (label: string) => void;
}

interface TranscriptionSession {
  stop: () => void;
}

export async function startTranscription(
  config: TranscriptionConfig
): Promise<TranscriptionSession> {
  const debug = (label: string) => {
    console.log(`[STT] ${label}`);
    config.onDebugStatus?.(label);
  };

  debug("Requesting mic permission...");

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      },
    });
    debug("Mic permission granted");
  } catch (err) {
    console.error("[STT] Mic access denied:", err);
    config.onError?.("Microphone access denied. Please allow microphone permissions.");
    config.onStatusChange?.("stopped");
    return { stop: () => {} };
  }

  // Try WebSocket backend first
  debug("Trying backend connection...");
  try {
    const session = await tryWebSocketBackend(config, stream, debug);
    debug("Backend connected ✓");
    return session;
  } catch (wsErr) {
    console.warn("[STT] Backend unavailable, falling back to browser STT:", wsErr);
    debug("Using browser STT");
    stream.getTracks().forEach((t) => t.stop());
  }

  // Fallback: browser Web Speech API
  try {
    return startBrowserSTT(config, debug);
  } catch (browserErr) {
    console.error("[STT] Browser STT also failed:", browserErr);
    config.onError?.("Voice input is not supported in this browser.");
    config.onStatusChange?.("stopped");
    return { stop: () => {} };
  }
}

// ── WebSocket Backend Path ────────────────────────────────────

function tryWebSocketBackend(
  config: TranscriptionConfig,
  stream: MediaStream,
  debug: (s: string) => void
): Promise<TranscriptionSession> {
  return new Promise((resolve, reject) => {
    const wsUrl = config.wsUrl || DEFAULT_WS_URL;
    const silenceTimeout = config.silenceTimeout ?? 2500;
    const chunkInterval = config.chunkInterval ?? 150;

    let stopped = false;
    let mediaRecorder: MediaRecorder | null = null;
    let ws: WebSocket | null = null;
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    let accumulatedFinal = "";
    let connected = false;

    const connectTimeout = setTimeout(() => {
      if (!connected && !stopped) {
        debug("Backend connection timeout");
        cleanup();
        reject(new Error("WebSocket connect timeout"));
      }
    }, WS_CONNECT_TIMEOUT_MS);

    const cleanup = () => {
      if (stopped) return;
      stopped = true;
      clearTimeout(connectTimeout);
      if (silenceTimer) clearTimeout(silenceTimer);
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        try { mediaRecorder.stop(); } catch {}
      }
      if (ws && ws.readyState <= WebSocket.OPEN) {
        try { ws.close(); } catch {}
      }
      stream.getTracks().forEach((t) => t.stop());
      config.onStatusChange?.("stopped");
      debug("Session stopped");
    };

    const resetSilenceTimer = () => {
      if (silenceTimer) clearTimeout(silenceTimer);
      if (stopped) return;
      silenceTimer = setTimeout(() => {
        debug("Silence timeout — finalizing");
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "stop" }));
        }
        setTimeout(cleanup, 400);
      }, silenceTimeout);
    };

    try {
      ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
    } catch (err) {
      clearTimeout(connectTimeout);
      stream.getTracks().forEach((t) => t.stop());
      reject(err);
      return;
    }

    ws.onopen = () => {
      if (stopped) return;
      connected = true;
      clearTimeout(connectTimeout);
      debug("Backend connected");
      config.onStatusChange?.("listening");
      resetSilenceTimer();
      startRecording();
      resolve({ stop: cleanup });
    };

    ws.onmessage = (event) => {
      if (stopped) return;
      try {
        const msg = JSON.parse(event.data as string);
        if (msg.type === "interim" && msg.text) {
          resetSilenceTimer();
          debug("Interim: " + msg.text);
          config.onInterim?.(accumulatedFinal + (accumulatedFinal ? " " : "") + msg.text);
        } else if (msg.type === "final" && msg.text) {
          resetSilenceTimer();
          accumulatedFinal = accumulatedFinal ? accumulatedFinal + " " + msg.text : msg.text;
          debug("Final: " + msg.text);
          config.onFinal?.(accumulatedFinal);
        } else if (msg.type === "error") {
          config.onError?.(msg.message || "Transcription error");
        }
      } catch {
        console.warn("[STT] unparseable message:", event.data);
      }
    };

    ws.onerror = () => {
      if (!connected && !stopped) {
        stopped = true;
        clearTimeout(connectTimeout);
        stream.getTracks().forEach((t) => t.stop());
        reject(new Error("WebSocket connection error"));
      } else if (!stopped) {
        config.onError?.("Voice connection lost. Please try again.");
        cleanup();
      }
    };

    ws.onclose = () => {
      if (!connected && !stopped) {
        stopped = true;
        clearTimeout(connectTimeout);
        stream.getTracks().forEach((t) => t.stop());
        reject(new Error("WebSocket closed before connect"));
        return;
      }
      if (!stopped) {
        if (accumulatedFinal) config.onFinal?.(accumulatedFinal);
        cleanup();
      }
    };

    function startRecording() {
      if (stopped || !stream) return;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";

      mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && ws && ws.readyState === WebSocket.OPEN) {
          ws.send(event.data);
        }
      };
      mediaRecorder.onerror = () => {
        debug("MediaRecorder error");
        config.onError?.("Audio recording error.");
        cleanup();
      };
      mediaRecorder.start(chunkInterval);
      debug("Recording started");
    }
  });
}

// ── Browser Web Speech API Fallback (Hinglish-aware) ──────────

function startBrowserSTT(
  config: TranscriptionConfig,
  debug: (s: string) => void
): TranscriptionSession {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    throw new Error("Browser SpeechRecognition not available");
  }

  const silenceTimeout = config.silenceTimeout ?? 2500;
  let stopped = false;
  let manualStop = false;
  let silenceTimer: ReturnType<typeof setTimeout> | null = null;
  let segments: string[] = [];
  let currentSessionFinal = "";
  let retryCount = 0;

  const recognition = new SpeechRecognition();

  // Use hi-IN as primary lang for Hinglish — Chrome's hi-IN model
  // handles mixed Hindi+English well. en-IN is added as alternative.
  recognition.lang = "hi-IN";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 3;

  const getAllFinal = () => {
    const seg = segments.join(" ").trim();
    const cur = currentSessionFinal.trim();
    if (seg && cur) return seg + " " + cur;
    return seg || cur;
  };

  const resetSilence = () => {
    if (silenceTimer) clearTimeout(silenceTimer);
    if (stopped) return;
    silenceTimer = setTimeout(() => {
      debug("Silence timeout — finalizing");
      finish();
    }, silenceTimeout);
  };

  const finish = () => {
    if (stopped) return;
    stopped = true;
    manualStop = true;
    if (silenceTimer) clearTimeout(silenceTimer);
    try { recognition.stop(); } catch {}

    // Minimal delay — just enough for last results to arrive
    setTimeout(() => {
      const finalText = getAllFinal();
      if (finalText) {
        debug("Final: " + finalText);
        config.onFinal?.(finalText);
      }
      config.onStatusChange?.("stopped");
      debug("Session stopped");
    }, 150);
  };

  const cleanup = () => {
    if (stopped) return;
    manualStop = true;
    finish();
  };

  recognition.onstart = () => {
    debug("Listening...");
    resetSilence();
  };

  recognition.onresult = (event: any) => {
    if (stopped) return;
    resetSilence();

    let sessionFinal = "";
    let sessionInterim = "";
    for (let i = 0; i < event.results.length; i++) {
      const r = event.results[i];
      // Pick best alternative (first is usually best)
      const transcript = r[0].transcript;
      if (r.isFinal) {
        sessionFinal += transcript;
      } else {
        sessionInterim += transcript;
      }
    }
    currentSessionFinal = sessionFinal;

    const allFinal = getAllFinal();

    // Show interim immediately for speed
    if (sessionInterim) {
      const interimDisplay = [allFinal, sessionInterim].filter(Boolean).join(" ");
      debug("Interim: " + sessionInterim);
      config.onInterim?.(interimDisplay);
    }

    // Commit final immediately
    if (sessionFinal) {
      debug("Final chunk: " + sessionFinal);
      config.onFinal?.(allFinal);
    }
  };

  recognition.onspeechstart = () => {
    debug("Speech detected");
    resetSilence();
  };

  recognition.onerror = (event: any) => {
    debug("Error: " + event.error);
    if (event.error === "no-speech" || event.error === "aborted") {
      retryCount++;
      if (retryCount >= 3) {
        debug("Too many retries — stopping");
        finish();
      }
      return;
    }
    if (retryCount < 2 && !stopped) {
      retryCount++;
      return;
    }
    config.onError?.("Voice input failed. Please try again.");
    finish();
  };

  recognition.onend = () => {
    if (!stopped && !manualStop) {
      const sf = currentSessionFinal.trim();
      if (sf) {
        segments.push(sf);
        currentSessionFinal = "";
      }
      try {
        recognition.start();
        debug("Restarting recognition");
      } catch {
        finish();
      }
    }
  };

  config.onStatusChange?.("listening");
  try {
    recognition.start();
    debug("Recognition starting...");
  } catch (err) {
    config.onStatusChange?.("stopped");
    throw err;
  }

  return { stop: cleanup };
}
