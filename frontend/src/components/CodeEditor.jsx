import { useState, useEffect, useCallback } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import { Copy, Check, RotateCcw, PlugZap, Plug, Upload, Trash2, AlertCircle, Send } from "lucide-react";
import { useWebSerial } from "@/hooks/useWebSerial";

const STORAGE_KEY = "embedded-for-kids-code-drafts";

function loadDraft(moduleId) {
  try {
    const map = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
    return map[moduleId];
  } catch {
    return undefined;
  }
}

function saveDraft(moduleId, code) {
  try {
    const map = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
    map[moduleId] = code;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota errors
  }
}

export function CodeEditor({ module }) {
  const [code, setCode] = useState(() => loadDraft(module.id) ?? module.code);
  const [copied, setCopied] = useState(false);
  const [baud, setBaud] = useState(115200);
  const { supported, connected, connect, disconnect, send, clear, lines, error } = useWebSerial();
  const [input, setInput] = useState("");

  useEffect(() => {
    setCode(loadDraft(module.id) ?? module.code);
  }, [module.id, module.code]);

  const updateCode = useCallback((next) => {
    setCode(next);
    saveDraft(module.id, next);
  }, [module.id]);

  const reset = () => updateCode(module.code);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const flash = async () => {
    if (!connected) return;
    const preview = code.split("\n").slice(0, 4).join(" | ");
    await send(`__FLASH_BEGIN__ bytes=${code.length}`);
    await send(`__FLASH_PREVIEW__ ${preview}`);
    await send("__FLASH_END__");
  };

  const submitLine = async () => {
    if (!input.trim() || !connected) return;
    await send(input);
    setInput("");
  };

  return (
    <div className="code-editor-wrap" data-testid="code-editor-wrap">
      <div className="code-editor-topline">
        <div className="code-tabs">
          <span className="tab active">main.c</span>
          <span className="tab">idf.py flash monitor</span>
        </div>
        <div className="code-editor-actions">
          <button className="code-copy" onClick={reset} data-testid="editor-reset-button">
            <RotateCcw size={12} /> Reset
          </button>
          <button className="code-copy" onClick={copy} data-testid="editor-copy-button">
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      <div className="code-editor-shell" data-testid="code-editor-shell">
        <Editor
          value={code}
          onValueChange={updateCode}
          highlight={(source) => Prism.highlight(source, Prism.languages.c, "c")}
          padding={{ top: 14, bottom: 14, left: 12, right: 12 }}
          textareaClassName="code-editor-textarea"
          preClassName="code-editor-pre"
          data-testid="code-editor-textarea"
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13,
            lineHeight: 1.6,
            outline: 0,
            minHeight: 320,
            background: "transparent",
          }}
        />
      </div>

      <div className="code-editor-hint" data-testid="code-editor-hint">
        <b>Tips</b>
        <span>{module.tutorial.Understand}</span>
      </div>

      <div className="hardware-controls" data-testid="hardware-controls">
        <label className="serial-baud">
          <span>BAUD</span>
          <select value={baud} onChange={(event) => setBaud(Number(event.target.value))} data-testid="hardware-baud">
            <option value={9600}>9600</option>
            <option value={57600}>57600</option>
            <option value={115200}>115200</option>
            <option value={230400}>230400</option>
          </select>
        </label>
        {connected ? (
          <button className="serial-disconnect" onClick={disconnect} data-testid="hardware-disconnect">
            <Plug size={13} /> Putuskan
          </button>
        ) : (
          <button className="serial-connect" onClick={() => connect(baud)} disabled={!supported} data-testid="hardware-connect">
            <PlugZap size={13} /> Hubungkan ESP32
          </button>
        )}
        <button className="serial-flash" onClick={flash} disabled={!connected} data-testid="hardware-flash">
          <Upload size={13} /> Flash Kode
        </button>
        <button className="serial-clear" onClick={clear} data-testid="hardware-clear">
          <Trash2 size={13} /> Bersihkan
        </button>
        <span className={`serial-status ${connected ? "on" : ""}`} data-testid="hardware-status">
          <span className="dot" /> {connected ? "CONNECTED" : "DISCONNECTED"}
        </span>
      </div>

      {!supported && (
        <div className="serial-warning" data-testid="hardware-unsupported">
          <AlertCircle size={13} />
          <span>Web Serial API belum tersedia di browser ini. Gunakan Chrome/Edge di komputer via HTTPS untuk flash ke ESP32 nyata.</span>
        </div>
      )}
      {error && (
        <div className="serial-error" data-testid="hardware-error">
          <AlertCircle size={13} /> {error}
        </div>
      )}

      <div className="serial-monitor tall" data-testid="hardware-monitor">
        {lines.length === 0 ? (
          <span className="serial-empty">Belum ada data. Hubungkan ESP32 lalu klik Flash Kode untuk mengirim.</span>
        ) : (
          lines.map((line, index) => (
            <div key={`${index}-${line.ts}`} className={`serial-line ${line.kind}`}>
              {line.text}
            </div>
          ))
        )}
      </div>
      <div className="serial-input">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && submitLine()}
          placeholder={connected ? "Ketik perintah lalu Enter untuk mengirim" : "Hubungkan ESP32 dulu untuk mengaktifkan input"}
          disabled={!connected}
          data-testid="hardware-input"
        />
        <button onClick={submitLine} disabled={!connected} data-testid="hardware-send">
          <Send size={12} /> Kirim
        </button>
      </div>
    </div>
  );
}
