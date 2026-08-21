import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Lightbulb, Radio, Cpu, Gauge, MonitorPlay, Send } from "lucide-react";

function useAnimationTicker(active, intervalMs, onTick) {
  const ref = useRef(onTick);
  ref.current = onTick;
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => ref.current && ref.current(), intervalMs);
    return () => clearInterval(id);
  }, [active, intervalMs]);
}

function VirtualSerial({ ticks, prefix = "log" }) {
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [ticks]);
  return (
    <div className="virtual-serial" ref={listRef} data-testid="virtual-serial">
      {ticks.length === 0 ? (
        <span className="serial-empty">Tekan Run untuk memulai simulasi...</span>
      ) : (
        ticks.map((line, index) => (
          <div key={`${index}-${line}`} className="serial-line">
            <b>I ({(index * 200).toString().padStart(5, "0")}) {prefix}:</b> {line}
          </div>
        ))
      )}
    </div>
  );
}

function LedSim({ running }) {
  const [on, setOn] = useState(false);
  useAnimationTicker(running, 500, () => setOn((prev) => !prev));
  useEffect(() => { if (!running) setOn(false); }, [running]);
  return (
    <div className="sim-stage" data-testid="sim-stage-led">
      <div className={`sim-led ${on && running ? "on" : ""}`} data-testid="sim-led">
        <Lightbulb size={44} fill={on && running ? "currentColor" : "none"} />
      </div>
      <span className="sim-caption">GPIO_NUM_2 · {running ? (on ? "HIGH" : "LOW") : "IDLE"}</span>
    </div>
  );
}

function ButtonSim({ running }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div className="sim-stage" data-testid="sim-stage-button">
      <div className={`sim-led ${pressed && running ? "on" : ""}`}>
        <Lightbulb size={40} fill={pressed && running ? "currentColor" : "none"} />
      </div>
      <button
        className={`sim-button ${pressed ? "down" : ""}`}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        data-testid="sim-button"
      >
        {pressed ? "TEKAN" : "TOMBOL"}
      </button>
      <span className="sim-caption">BOOT · {pressed ? "LOW" : "HIGH"}</span>
    </div>
  );
}

function PotSim({ running }) {
  const [value, setValue] = useState(2048);
  const raw = Math.round(value);
  return (
    <div className="sim-stage pot" data-testid="sim-stage-pot">
      <div className="pot-dial" style={{ transform: `rotate(${(value / 4095) * 270 - 135}deg)` }}>
        <Gauge size={38} />
      </div>
      <input
        type="range"
        min="0"
        max="4095"
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="pot-slider"
        data-testid="sim-pot-slider"
      />
      <span className="sim-caption">ADC raw = {raw}</span>
    </div>
  );
}

function SensorSim({ running }) {
  const [light, setLight] = useState(600);
  const dark = light < 800;
  return (
    <div className="sim-stage" data-testid="sim-stage-sensor">
      <div className={`sim-sensor ${dark ? "dark" : "bright"}`}>{dark ? "GELAP" : "TERANG"}</div>
      <input
        type="range"
        min="0"
        max="4095"
        value={light}
        onChange={(event) => setLight(Number(event.target.value))}
        className="pot-slider"
        data-testid="sim-sensor-slider"
      />
      <span className="sim-caption">LDR = {light} · threshold 800</span>
    </div>
  );
}

function WifiSim({ running }) {
  const [state, setState] = useState("idle");
  useEffect(() => {
    if (!running) { setState("idle"); return undefined; }
    setState("connecting");
    const t = setTimeout(() => setState("connected"), 1600);
    return () => clearTimeout(t);
  }, [running]);
  return (
    <div className="sim-stage" data-testid="sim-stage-wifi">
      <div className={`sim-wifi ${state}`}>
        <Radio size={38} />
      </div>
      <span className="sim-caption">
        Wi-Fi · {state === "idle" ? "OFF" : state === "connecting" ? "menghubungkan..." : "CONNECTED 192.168.1.42"}
      </span>
    </div>
  );
}

function MultiSim({ running }) {
  const [blink, setBlink] = useState(false);
  const [count, setCount] = useState(0);
  useAnimationTicker(running, 300, () => setBlink((prev) => !prev));
  useAnimationTicker(running, 1000, () => setCount((prev) => prev + 1));
  useEffect(() => { if (!running) { setBlink(false); setCount(0); } }, [running]);
  return (
    <div className="sim-stage" data-testid="sim-stage-multi">
      <div className={`sim-led ${blink && running ? "on" : ""}`}>
        <Lightbulb size={36} fill={blink && running ? "currentColor" : "none"} />
      </div>
      <div className="sim-heartbeat">
        <Cpu size={18} />
        <span>heartbeat: {count}</span>
      </div>
    </div>
  );
}

function SandboxSim({ running }) {
  return (
    <div className="sim-stage" data-testid="sim-stage-sandbox">
      <div className="sim-sandbox">
        <MonitorPlay size={26} />
        <span>Sandbox lokal · siap kamu kustom</span>
      </div>
      <span className="sim-caption">Tulis kode kamu sendiri di editor.</span>
    </div>
  );
}

const stageMap = {
  led: LedSim,
  button: ButtonSim,
  pot: PotSim,
  sensor: SensorSim,
  wifi: WifiSim,
  multi: MultiSim,
  serial: LedSim,
  sandbox: SandboxSim,
};

function generateTicks(kind) {
  if (kind === "pot") return ["POT raw=1220", "POT raw=2140", "POT raw=3010", "POT raw=1890"];
  if (kind === "sensor") return ["SENSE GELAP (612)", "SENSE TERANG (2400)", "SENSE GELAP (410)"];
  if (kind === "serial") return ["kamu: halo", "halo balik!", "kamu: uji", "halo balik!"];
  if (kind === "wifi") return ["WIFI scan...", "WIFI trying SSID...", "WIFI got ip 192.168.1.42"];
  if (kind === "multi") return ["HEARTBEAT alive", "HEARTBEAT alive", "HEARTBEAT alive"];
  if (kind === "led") return ["GPIO 2 = HIGH", "GPIO 2 = LOW", "GPIO 2 = HIGH", "GPIO 2 = LOW"];
  return ["ready.", "waiting..."];
}

export function SimulationPanel({ module }) {
  const [running, setRunning] = useState(false);
  const [ticks, setTicks] = useState([]);
  const kind = module.simKind || "led";
  const Stage = stageMap[kind] || LedSim;
  const [input, setInput] = useState("");

  const run = () => {
    setRunning(true);
    setTicks(generateTicks(kind));
  };
  const reset = () => {
    setRunning(false);
    setTicks([]);
  };
  const send = () => {
    if (!input.trim()) return;
    setTicks((prev) => [...prev, `kamu: ${input}`, `halo balik: ${input}`]);
    setInput("");
  };

  return (
    <div className="sim-panel" data-testid="simulation-panel">
      <div className="sim-controls">
        <button className="sim-run" onClick={run} data-testid="sim-run-button">
          <Play size={13} fill="currentColor" /> {running ? "Ulang Run" : "Run"}
        </button>
        <button className="sim-reset" onClick={reset} data-testid="sim-reset-button">
          <RotateCcw size={13} /> Reset
        </button>
        <span className={`sim-status ${running ? "on" : ""}`}>
          <span className="dot" /> {running ? "RUNNING" : "IDLE"}
        </span>
      </div>
      <Stage running={running} />
      <div className="sim-serial-wrap">
        <div className="sim-serial-head">
          <span>VIRTUAL SERIAL MONITOR</span>
          <b>115200 · 8N1</b>
        </div>
        <VirtualSerial ticks={ticks} prefix={module.title.split(" ")[0].toLowerCase()} />
        {kind === "serial" && (
          <div className="sim-serial-input">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ketik pesan lalu tekan Send"
              data-testid="sim-serial-input"
              onKeyDown={(event) => event.key === "Enter" && send()}
            />
            <button onClick={send} data-testid="sim-serial-send">
              <Send size={12} /> Kirim
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
