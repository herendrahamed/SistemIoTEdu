import { useCallback, useRef, useState } from "react";

export function useWebSerial() {
  const portRef = useRef(null);
  const readerRef = useRef(null);
  const readLoopRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [supported] = useState(() => typeof navigator !== "undefined" && "serial" in navigator);
  const [lines, setLines] = useState([]);
  const [error, setError] = useState("");

  const pushLine = useCallback((text, kind = "in") => {
    setLines((prev) => [...prev.slice(-199), { text, kind, ts: Date.now() }]);
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (readerRef.current) {
        try { await readerRef.current.cancel(); } catch (_) {}
        try { readerRef.current.releaseLock(); } catch (_) {}
      }
      if (portRef.current) {
        try { await portRef.current.close(); } catch (_) {}
      }
    } finally {
      readerRef.current = null;
      portRef.current = null;
      readLoopRef.current = null;
      setConnected(false);
    }
  }, []);

  const connect = useCallback(async (baudRate = 115200) => {
    setError("");
    if (!supported) {
      setError("Web Serial API tidak tersedia di browser ini. Gunakan Chrome/Edge di desktop dengan HTTPS.");
      return false;
    }
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate });
      portRef.current = port;
      setConnected(true);
      pushLine(`[terhubung pada baud ${baudRate}]`, "sys");
      const decoder = new TextDecoderStream();
      const readableClosed = port.readable.pipeTo(decoder.writable).catch(() => {});
      const reader = decoder.readable.getReader();
      readerRef.current = reader;
      readLoopRef.current = readableClosed;
      let buffer = "";
      (async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
              buffer += value;
              let idx;
              while ((idx = buffer.indexOf("\n")) >= 0) {
                const line = buffer.slice(0, idx).replace(/\r/g, "");
                buffer = buffer.slice(idx + 1);
                if (line.length) pushLine(line, "in");
              }
            }
          }
        } catch (readErr) {
          if (readErr && readErr.message) pushLine(`[error: ${readErr.message}]`, "sys");
        }
      })();
      return true;
    } catch (err) {
      setError(err?.message || "Gagal terhubung ke port.");
      setConnected(false);
      return false;
    }
  }, [pushLine, supported]);

  const send = useCallback(async (text) => {
    if (!portRef.current) return false;
    try {
      const writer = portRef.current.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(text.endsWith("\n") ? text : text + "\n"));
      writer.releaseLock();
      pushLine(`> ${text}`, "out");
      return true;
    } catch (err) {
      setError(err?.message || "Gagal mengirim data.");
      return false;
    }
  }, [pushLine]);

  const clear = useCallback(() => setLines([]), []);

  return { supported, connected, connect, disconnect, send, clear, lines, error };
}
