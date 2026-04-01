/**
 * Speech transcription service with automatic fallback.
 *
 * Strategy:
 * 1. Try backend WebSocket (faster-whisper) for best accuracy
 * 2. If WebSocket fails to connect within 3s, fall back to browser Web Speech API
 *
 * Both paths expose the same callback interface.
 */

// ── Configuration ──────────────────────────────────────────────
const DEFAULT_WS_URL = "wss://api.mycodex.dev/ws/transcribe";
const WS_CONNECT_TIMEOUT_MS = 3000;

export interface TranscriptionConfig {
  wsUrl?: string;
  /** Silence timeout in ms before auto-stop (default 4000) */
  silenceTimeout?: number;
  /** Audio chunk interval in ms (default 250) */
  chunkInterval?: number;
  onInterim?: (text: string) => void;
  onFinal?: (text: string) => void;
  onError?: (msg: string) => void;
  onStatusChange?: (status: "connecting" | "listening" | "stopped") => void;
  /** Debug status for UI display */
  onDebugStatus?: (label: string) => void;
}

interface TranscriptionSession {
  stop: () => void;
}

// ── Public API ─────────────────────────────────────────────────

export async function startTranscription(
  config: TranscriptionConfig
): Promise<TranscriptionSession> {
  const debug = (label: string) => {
    console.log(`[STT] ${label}`);
    config.onDebugStatus?.(label);
  };

  debug("Requesting mic permission...");

  // 1. Get microphone access first (shared by both paths)
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

  // 2. Try WebSocket backend first
  debug("Trying backend connection...");
  try {
    const session = await tryWebSocketBackend(config, stream, debug);
    debug("Backend connected ✓");
    return session;
  } catch (wsErr) {
    console.warn("[STT] Backend unavailable, falling back to browser STT:", wsErr);
    debug("Backend unavailable — using browser STT");
    // Release the mic stream; browser STT opens its own
    stream.getTracks().forEach((t) => t.stop());
  }

  // 3. Fallback: browser Web Speech API
  try {
    const session = startBrowserSTT(config, debug);
    return session;
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
    const silenceTimeout = config.silenceTimeout ?? 4000;
    const chunkInterval = config.chunkInterval ?? 250;

    let stopped = false;
    let mediaRecorder: MediaRecorder | null = null;
    let ws: WebSocket | null = null;
    let silenceTimer: ReturnType<typeof setTimeout> | null = null;
    let accumulatedFinal = "";
    let lastEmittedFinal = "";
    let connected = false;

    // Timeout: if WS doesn't connect in time, reject to trigger fallback
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
        setTimeout(cleanup, 500);
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
        debug(`Transcript received: ${msg.type}`);

        if (msg.type === "interim" && msg.text) {
          resetSilenceTimer();
          config.onInterim?.(accumulatedFinal + (accumulatedFinal ? " " : "") + msg.text);
        } else if (msg.type === "final" && msg.text) {
          resetSilenceTimer();
          accumulatedFinal = accumulatedFinal ? accumulatedFinal + " " + msg.text : msg.text;
          lastEmittedFinal = accumulatedFinal;
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
        // Connection never succeeded — reject to trigger fallback
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
          debug("Sending audio chunk");
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

// ── Browser Web Speech API Fallback ───────────────────────────

function startBrowserSTT(
  config: TranscriptionConfig,
  debug: (s: string) => void
): TranscriptionSession {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    throw new Error("Browser SpeechRecognition not available");
  }

  const silenceTimeout = config.silenceTimeout ?? 4000;
  let stopped = false;
  let manualStop = false;
  let silenceTimer: ReturnType<typeof setTimeout> | null = null;
  let segments: string[] = [];
  let currentSessionFinal = "";
  let retryCount = 0;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

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

    setTimeout(() => {
      const finalText = getAllFinal();
      if (finalText) {
        debug("Final transcript: " + finalText);
        config.onFinal?.(finalText);
      }
      config.onStatusChange?.("stopped");
      debug("Session stopped");
    }, 300);
  };

  const cleanup = () => {
    if (stopped) return;
    manualStop = true;
    finish();
  };

  recognition.onstart = () => {
    debug("Listening (browser STT)");
    resetSilence();
  };

  recognition.onresult = (event: any) => {
    if (stopped) return;
    resetSilence();

    let sessionFinal = "";
    let sessionInterim = "";
    for (let i = 0; i < event.results.length; i++) {
      const r = event.results[i];
      if (r.isFinal) {
        sessionFinal += r[0].transcript;
      } else {
        sessionInterim += r[0].transcript;
      }
    }
    currentSessionFinal = sessionFinal;

    // Build combined text for display
    const allFinal = getAllFinal();
    const interimDisplay = [allFinal, sessionInterim].filter(Boolean).join(" ");
    
    if (sessionInterim) {
      debug("Interim: " + sessionInterim);
      config.onInterim?.(interimDisplay);
    }
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
      return; // onend will auto-restart
    }
    if (retryCount < 2 && !stopped) {
      retryCount++;
      return; // let onend restart
    }
    config.onError?.("Voice input failed. Please try again.");
    finish();
  };

  recognition.onend = () => {
    if (!stopped && !manualStop) {
      // Save session finals before restart
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
