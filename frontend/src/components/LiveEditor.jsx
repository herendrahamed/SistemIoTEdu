import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import {
  Copy,
  Check,
  RotateCcw,
  PlugZap,
  Plug,
  Upload,
  Trash2,
  AlertCircle,
  Send,
  Pencil,
  TerminalSquare,
} from "lucide-react";
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

export function LiveEditor({ module }) {
  const [code, setCode] = useState(() => loadDraft(module.id) ?? module.code);
  const [copied, setCopied] = useState(false);
  const [activePage, setActivePage] = useState("editor");
  const [baud, setBaud] = useState(115200);
  const [input, setInput] = useState("");
  const monitorRef = useRef(null);
  const { supported, connected, connect, disconnect, send, clear, lines, error } = useWebSerial();

  useEffect(() => {
    setCode(loadDraft(module.id) ?? module.code);
  }, [module.id, module.code]);

  useEffect(() => {
    if (activePage === "terminal" && monitorRef.current) {
      monitorRef.current.scrollTop = monitorRef.current.scrollHeight;
    }
  }, [activePage, lines.length]);

  const updateCode = useCallback((next) => {
    setCode(next);
    saveDraft(module.id, next);
  }, [module.id]);

  const resetCode = () => updateCode(module.code);

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
    setActivePage("terminal");
  };

  const submitLine = async () => {
    if (!input.trim() || !connected) return;
    await send(input);
    setInput("");
  };

  return (
    <div className="live-editor-wrap" data-testid="live-editor-wrap">
      <div className="live-editor-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={activePage === "editor"}
          className={activePage === "editor" ? "active" : ""}
          onClick={() => setActivePage("editor")}
          data-testid="live-tab-editor"
        >
          <Pencil size={13} /> Editor
        </button>
        <button
          role="tab"
          aria-selected={activePage === "terminal"}
          className={activePage === "terminal" ? "active" : ""}
          onClick={() => setActivePage("terminal")}
          data-testid="live-tab-terminal"
        >
          <TerminalSquare size={13} /> Terminal
          {lines.length > 0 && <span className="tab-badge">{lines.length}</span>}
        </button>
        {activePage === "editor" ? (
          <div className="live-editor-actions">
            <button className="code-copy" onClick={resetCode} data-testid="editor-reset-button">
              <RotateCcw size={12} /> Reset
            </button>
            <button className="code-copy" onClick={copy} data-testid="editor-copy-button">
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Tersalin" : "Salin"}
            </button>
          </div>
        ) : (
          <div className="live-editor-actions">
            <button className="code-copy" onClick={clear} data-testid="terminal-clear-button">
              <Trash2 size={12} /> Bersihkan
            </button>
          </div>
        )}
      </div>

      {activePage === "editor" ? (
        <div className="code-editor-shell tall" data-testid="code-editor-shell">
          <Editor
            value={code}
            onValueChange={updateCode}
            highlight={(source) => Prism.highlight(source, Prism.languages.c, "c")}
            padding={{ top: 14, bottom: 40, left: 12, right: 12 }}
            textareaClassName="code-editor-textarea"
            preClassName="code-editor-pre"
            data-testid="code-editor-textarea"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 13,
              lineHeight: 1.6,
              outline: 0,
              minHeight: 520,
              background: "transparent",
            }}
          />
        </div>
      ) : (
        <div className="serial-monitor tall inline" data-testid="hardware-monitor" ref={monitorRef}>
          {lines.length === 0 ? (
            <span className="serial-empty">
              Belum ada data. Klik Flash Kode untuk mengirim kode ke ESP32 yang terhubung.
            </span>
          ) : (
            lines.map((line, index) => (
              <div key={`${index}-${line.ts}`} className={`serial-line ${line.kind}`}>
                {line.text}
              </div>
            ))
          )}
        </div>
      )}

      {activePage === "terminal" && (
        <div className="serial-input inline">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && submitLine()}
            placeholder={
              connected
                ? "Ketik perintah lalu Enter untuk mengirim"
                : "Hubungkan ESP32 dulu untuk mengaktifkan input"
            }
            disabled={!connected}
            data-testid="hardware-input"
          />
          <button onClick={submitLine} disabled={!connected} data-testid="hardware-send">
            <Send size={12} /> Kirim
          </button>
        </div>
      )}

      <div className="hardware-controls" data-testid="hardware-controls">
        <label className="serial-baud">
          <span>BAUD</span>
          <select
            value={baud}
            onChange={(event) => setBaud(Number(event.target.value))}
            data-testid="hardware-baud"
          >
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
          <button
            className="serial-connect"
            onClick={() => connect(baud)}
            disabled={!supported}
            data-testid="hardware-connect"
          >
            <PlugZap size={13} /> Hubungkan ESP32
          </button>
        )}
        <button
          className="serial-flash"
          onClick={flash}
          disabled={!connected}
          data-testid="hardware-flash"
        >
          <Upload size={13} /> Flash Kode
        </button>
        <button className="serial-clear" onClick={clear} data-testid="hardware-clear">
          <Trash2 size={13} /> Bersihkan
        </button>
        <span
          className={`serial-status ${connected ? "on" : ""}`}
          data-testid="hardware-status"
        >
          <span className="dot" /> {connected ? "CONNECTED" : "DISCONNECTED"}
        </span>
      </div>

      {!supported && (
        <div className="serial-warning" data-testid="hardware-unsupported">
          <AlertCircle size={13} />
          <span>
            Web Serial API belum tersedia di browser ini. Gunakan Chrome/Edge di komputer via HTTPS untuk flash ke ESP32 nyata.
          </span>
        </div>
      )}
      {error && (
        <div className="serial-error" data-testid="hardware-error">
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}
