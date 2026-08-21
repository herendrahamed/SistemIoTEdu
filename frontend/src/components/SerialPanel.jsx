import { useState } from "react";
import { Plug, PlugZap, Send, Trash2, Upload, AlertCircle } from "lucide-react";
import { useWebSerial } from "@/hooks/useWebSerial";

export function SerialPanel({ code }) {
  const { supported, connected, connect, disconnect, send, clear, lines, error } = useWebSerial();
  const [input, setInput] = useState("");
  const [baud, setBaud] = useState(115200);

  const submit = async () => {
    if (!input.trim()) return;
    await send(input);
    setInput("");
  };

  const flashDemo = async () => {
    await send("__flash_command__");
    await send(`// menandai upload firmware (simulasi): ${code.length} byte`);
  };

  return (
    <div className="serial-panel" data-testid="serial-panel">
      {!supported && (
        <div className="serial-warning" data-testid="serial-unsupported">
          <AlertCircle size={14} />
          <span>Browser ini belum mendukung Web Serial API. Gunakan Chrome/Edge di komputer melalui HTTPS.</span>
        </div>
      )}
      <div className="serial-controls">
        <label className="serial-baud">
          <span>BAUD</span>
          <select value={baud} onChange={(event) => setBaud(Number(event.target.value))} data-testid="serial-baud">
            <option value={9600}>9600</option>
            <option value={57600}>57600</option>
            <option value={115200}>115200</option>
            <option value={230400}>230400</option>
          </select>
        </label>
        {connected ? (
          <button className="serial-disconnect" onClick={disconnect} data-testid="serial-disconnect-button">
            <Plug size={13} /> Putuskan
          </button>
        ) : (
          <button className="serial-connect" onClick={() => connect(baud)} disabled={!supported} data-testid="serial-connect-button">
            <PlugZap size={13} /> Hubungkan Port
          </button>
        )}
        <button className="serial-flash" onClick={flashDemo} disabled={!connected} data-testid="serial-flash-button">
          <Upload size={13} /> Kirim Perintah
        </button>
        <button className="serial-clear" onClick={clear} data-testid="serial-clear-button">
          <Trash2 size={13} /> Bersihkan
        </button>
        <span className={`serial-status ${connected ? "on" : ""}`} data-testid="serial-status">
          <span className="dot" /> {connected ? "CONNECTED" : "DISCONNECTED"}
        </span>
      </div>
      {error && (
        <div className="serial-error" data-testid="serial-error">
          <AlertCircle size={13} /> {error}
        </div>
      )}
      <div className="serial-monitor" data-testid="serial-monitor">
        {lines.length === 0 ? (
          <span className="serial-empty">Belum ada data. Hubungkan port dan ESP32 fisik untuk melihat log asli.</span>
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
          placeholder={connected ? "Ketik perintah lalu Enter untuk mengirim ke ESP32" : "Hubungkan port dulu untuk mengaktifkan input"}
          disabled={!connected}
          onKeyDown={(event) => event.key === "Enter" && submit()}
          data-testid="serial-input"
        />
        <button onClick={submit} disabled={!connected} data-testid="serial-send-button">
          <Send size={12} /> Kirim
        </button>
      </div>
    </div>
  );
}
