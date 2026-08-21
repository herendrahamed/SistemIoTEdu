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
  Pencil,
  TerminalSquare,
  MonitorPlay,
  ChevronRight,
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

/**
 * Parse an incoming serial line into an ESP-IDF style log entry.
 * ESP-IDF format: `I (12345) TAG: message`.  We also accept plain text.
 */
function parseIdfLine(raw) {
  const match = raw.match(/^([IWED])\s*\((\d+)\)\s*([^:]+):\s*(.*)$/);
  if (match) {
    return { level: match[1], time: match[2], tag: match[3], message: match[4] };
  }
  return { level: null, time: null, tag: null, message: raw };
}

const levelClass = { I: "level-i", W: "level-w", E: "level-e", D: "level-d" };
const levelName = { I: "INFO", W: "WARN", E: "ERROR", D: "DEBUG" };

export function LiveEditor({ module }) {
  const [code, setCode] = useState(() => loadDraft(module.id) ?? module.code);
  const [copied, setCopied] = useState(false);
  const [activePage, setActivePage] = useState("editor");
  const [baud, setBaud] = useState(115200);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const monitorRef = useRef(null);
  const shellRef = useRef(null);
  const terminalInputRef = useRef(null);
  const { supported, connected, connect, disconnect, send, clear, lines, error } = useWebSerial();

  useEffect(() => {
    setCode(loadDraft(module.id) ?? module.code);
    setHistory([]);
  }, [module.id, module.code]);

  useEffect(() => {
    if (activePage === "monitor" && monitorRef.current) {
      monitorRef.current.scrollTop = monitorRef.current.scrollHeight;
    }
    if (activePage === "terminal" && shellRef.current) {
      shellRef.current.scrollTop = shellRef.current.scrollHeight;
    }
  }, [activePage, lines.length]);

  useEffect(() => {
    if (activePage === "terminal") terminalInputRef.current?.focus();
  }, [activePage]);

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
    setActivePage("monitor");
  };

  const submitLine = async () => {
    const value = input.trim();
    if (!value) return;
    if (!connected) {
      setHistory((prev) => [...prev.slice(-99), { text: value, kind: "out", ts: Date.now() }, { text: "esp32> perangkat belum terhubung. Klik 'Hubungkan ESP32' dulu.", kind: "sys", ts: Date.now() }]);
      setInput("");
      return;
    }
    setHistory((prev) => [...prev.slice(-99), { text: value, kind: "out", ts: Date.now() }]);
    await send(value);
    setInput("");
  };

  const clearAll = () => {
    clear();
    setHistory([]);
  };

  const combinedLog = [...lines, ...history].sort((a, b) => a.ts - b.ts);

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
        </button>
        <button
          role="tab"
          aria-selected={activePage === "monitor"}
          className={activePage === "monitor" ? "active" : ""}
          onClick={() => setActivePage("monitor")}
          data-testid="live-tab-monitor"
        >
          <MonitorPlay size={13} /> Serial Monitor
          {lines.length > 0 && <span className="tab-badge">{lines.length}</span>}
        </button>
        <div className="live-editor-actions">
          {activePage === "editor" ? (
            <>
              <button className="code-copy" onClick={resetCode} data-testid="editor-reset-button">
                <RotateCcw size={12} /> Reset
              </button>
              <button className="code-copy" onClick={copy} data-testid="editor-copy-button">
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Tersalin" : "Salin"}
              </button>
            </>
          ) : (
            <button className="code-copy" onClick={clearAll} data-testid="terminal-clear-button">
              <Trash2 size={12} /> Bersihkan
            </button>
          )}
        </div>
      </div>

      {activePage === "editor" && (
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
      )}

      {activePage === "terminal" && (
        <div className="shell-terminal" data-testid="hardware-terminal">
          <div className="shell-topbar">
            <span className="shell-dots"><i /><i /><i /></span>
            <span className="shell-title">esp32@embedded-for-kids · idf.py monitor</span>
            <span className={`shell-status ${connected ? "on" : ""}`}>{connected ? "CONNECTED" : "DISCONNECTED"}</span>
          </div>
          <div className="shell-body" ref={shellRef} onClick={() => terminalInputRef.current?.focus()}>
            <div className="shell-line sys">— Welcome to the Embedded for Kids serial shell —</div>
            <div className="shell-line sys">Ketik <b>help</b> lalu Enter untuk melihat perintah tersedia.</div>
            {combinedLog.map((line, index) => (
              <div key={`${index}-${line.ts}`} className={`shell-line ${line.kind}`}>
                {line.kind === "out" ? (
                  <>
                    <ChevronRight size={11} className="shell-prompt-icon" />
                    <span>{line.text}</span>
                  </>
                ) : (
                  <span>{line.text}</span>
                )}
              </div>
            ))}
            <div className="shell-input-line">
              <ChevronRight size={11} className="shell-prompt-icon" />
              <input
                ref={terminalInputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && submitLine()}
                placeholder={connected ? "ketik perintah..." : "hubungkan ESP32 dulu untuk mengirim perintah"}
                data-testid="hardware-input"
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      )}

      {activePage === "monitor" && (
        <div className="idf-monitor" data-testid="hardware-monitor" ref={monitorRef}>
          <div className="monitor-topbar">
            <span className="monitor-title">idf.py monitor · baud {baud}</span>
            <span className="monitor-hint">Tekan <kbd>Ctrl</kbd>+<kbd>]</kbd> untuk keluar (simulasi)</span>
          </div>
          <div className="monitor-body">
            {lines.length === 0 ? (
              <div className="monitor-empty">Menunggu log dari ESP32... Hubungkan perangkat lalu klik Flash Kode.</div>
            ) : (
              lines.map((line, index) => {
                const parsed = parseIdfLine(line.text);
                const cls = parsed.level ? levelClass[parsed.level] : "level-plain";
                return (
                  <div key={`${index}-${line.ts}`} className={`monitor-line ${cls}`}>
                    {parsed.level ? (
                      <>
                        <span className="tag-level">{parsed.level}</span>
                        <span className="tag-time">({parsed.time})</span>
                        <span className="tag-name">{parsed.tag}</span>
                        <span className="tag-msg">{parsed.message}</span>
                      </>
                    ) : (
                      <span className="tag-msg">{line.text}</span>
                    )}
                    {parsed.level && (
                      <span className="tag-badge" title={levelName[parsed.level]}>{levelName[parsed.level]}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <div className="hardware-controls" data-testid="hardware-controls">
        <div className="hardware-controls-left">
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
        </div>
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
