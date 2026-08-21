import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
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
  TerminalSquare,
  X,
} from "lucide-react";
import { useWebSerial } from "@/hooks/useWebSerial";

export function CodeEditor({ module }) {
  const [activeLine, setActiveLine] = useState(0);
  const [copied, setCopied] = useState(false);
  const [baud, setBaud] = useState(115200);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const { supported, connected, connect, disconnect, send, clear, lines, error } = useWebSerial();
  const [input, setInput] = useState("");

  useEffect(() => {
    setActiveLine(0);
  }, [module.id]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(module.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const resetSelection = () => setActiveLine(0);

  const flash = async () => {
    if (!connected) return;
    const preview = module.code.split("\n").slice(0, 4).join(" | ");
    await send(`__FLASH_BEGIN__ bytes=${module.code.length}`);
    await send(`__FLASH_PREVIEW__ ${preview}`);
    await send("__FLASH_END__");
  };

  const submitLine = async () => {
    if (!input.trim() || !connected) return;
    await send(input);
    setInput("");
  };

  const totalLines = module.code.split("\n").length;
  const explanation = module.lines[activeLine];

  return (
    <div className="code-editor-wrap" data-testid="code-editor-wrap">
      <div className="code-editor-topline">
        <div className="code-tabs">
          <span className="tab active">main.c</span>
          <span className="tab">idf.py flash monitor</span>
        </div>
        <div className="code-editor-actions">
          <button className="code-copy" onClick={resetSelection} data-testid="editor-reset-button">
            <RotateCcw size={12} /> Reset
          </button>
          <button
            className={`code-copy ${terminalOpen ? "is-active" : ""}`}
            onClick={() => setTerminalOpen(true)}
            data-testid="editor-terminal-button"
          >
            <TerminalSquare size={12} /> Terminal
          </button>
          <button className="code-copy" onClick={copy} data-testid="editor-copy-button">
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      <div className="code-viewer-shell" data-testid="code-editor-shell">
        <SyntaxHighlighter
          language="c"
          style={oneLight}
          showLineNumbers
          wrapLines
          lineProps={(lineNumber) => ({
            style: {
              display: "block",
              cursor: "pointer",
              background: lineNumber === activeLine + 1 ? "#fff2e8" : "transparent",
              borderLeft:
                lineNumber === activeLine + 1 ? "3px solid var(--orange)" : "3px solid transparent",
              paddingLeft: 6,
            },
            onClick: () => setActiveLine(lineNumber - 1),
            "data-testid": `code-line-${lineNumber}`,
          })}
          customStyle={{
            margin: 0,
            padding: "16px 8px 16px 0",
            background: "#fdfaf7",
            fontSize: 13,
            lineHeight: 1.65,
            minHeight: 460,
          }}
          codeTagProps={{
            style: { fontFamily: '"JetBrains Mono", monospace', fontSize: 13 },
          }}
        >
          {module.code}
        </SyntaxHighlighter>
      </div>

      <div className="code-explain-panel" data-testid="code-explain-panel">
        <div className="code-explain-head">
          <span className="explain-line">
            BARIS {String(activeLine + 1).padStart(2, "0")} / {String(totalLines).padStart(2, "0")}
          </span>
          <small>Klik baris kode mana pun untuk melihat penjelasannya.</small>
        </div>
        <p data-testid="code-explanation">
          {explanation ||
            "Baris ini kosong — biasanya untuk memisahkan bagian kode supaya lebih mudah dibaca."}
        </p>
      </div>

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
            Web Serial API belum tersedia di browser ini. Gunakan Chrome/Edge di komputer via HTTPS
            untuk flash ke ESP32 nyata.
          </span>
        </div>
      )}
      {error && (
        <div className="serial-error" data-testid="hardware-error">
          <AlertCircle size={13} /> {error}
        </div>
      )}

      {terminalOpen && (
        <div
          className="terminal-backdrop"
          onClick={() => setTerminalOpen(false)}
          data-testid="terminal-modal"
        >
          <div className="terminal-modal" onClick={(event) => event.stopPropagation()}>
            <div className="terminal-topline">
              <div className="terminal-title">
                <TerminalSquare size={14} />
                <span>SERIAL MONITOR · {connected ? "CONNECTED" : "DISCONNECTED"}</span>
              </div>
              <div className="terminal-actions">
                <button
                  className="code-copy"
                  onClick={clear}
                  data-testid="terminal-clear-button"
                >
                  <Trash2 size={12} /> Bersihkan
                </button>
                <button
                  className="code-copy"
                  onClick={() => setTerminalOpen(false)}
                  aria-label="Tutup terminal"
                  data-testid="terminal-close-button"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
            <div className="serial-monitor tall" data-testid="hardware-monitor">
              {lines.length === 0 ? (
                <span className="serial-empty">
                  Belum ada data. Hubungkan ESP32 lalu klik Flash Kode untuk mengirim.
                </span>
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
          </div>
        </div>
      )}
    </div>
  );
}
