import { useState } from "react";
import { ArrowLeft, Cpu, MonitorPlay, Sparkles, Trophy } from "lucide-react";
import { tutorialSteps } from "@/playgroundData";
import { CodePanel } from "@/components/CodePanel";
import { SimulationPanel } from "@/components/SimulationPanel";
import { SerialPanel } from "@/components/SerialPanel";

export function PlaygroundDetail({ module, onBack }) {
  const [activeTutorial, setActiveTutorial] = useState("Do");
  const [execMode, setExecMode] = useState("simulation");

  return (
    <section className="content-wrap playground-detail" data-testid="playground-detail">
      <button className="detail-back" onClick={onBack} data-testid="playground-detail-back">
        <ArrowLeft size={14} /> Kembali ke ringkasan
      </button>
      <div className="detail-head">
        <div className="playground-kicker">
          <span className="sparkle-mark"><Cpu size={16} /></span>
          LAB / EXPERIMENT {module.number}
        </div>
        <h1 className="playground-title" data-testid="playground-detail-title">
          {module.title}<br /><em>{module.focus}.</em>
        </h1>
      </div>

      <div className="tutorial-tabs" data-testid="tutorial-tabs">
        {tutorialSteps.map((step) => (
          <button
            key={step}
            className={activeTutorial === step ? "active" : ""}
            onClick={() => setActiveTutorial(step)}
            data-testid={`tutorial-tab-${step.toLowerCase()}`}
          >
            {step}
          </button>
        ))}
      </div>
      <div className="tutorial-body" data-testid="tutorial-body">
        <div className="tutorial-label">{activeTutorial.toUpperCase()}</div>
        <p data-testid="tutorial-copy">{module.tutorial[activeTutorial]}</p>
      </div>

      <div className="detail-grid">
        <div className="detail-column code-column">
          <div className="column-heading">
            <b>KODE C / ESP-IDF</b>
            <span>Klik baris untuk penjelasan singkat</span>
          </div>
          <CodePanel code={module.code} lines={module.lines} />
        </div>
        <div className="detail-column runtime-column">
          <div className="column-heading">
            <b>PANEL EKSEKUSI</b>
            <span>Pilih mode: simulasi lokal atau perangkat nyata</span>
          </div>
          <div className="exec-mode-switch" data-testid="exec-mode-switch">
            <button
              className={execMode === "simulation" ? "active" : ""}
              onClick={() => setExecMode("simulation")}
              data-testid="exec-mode-simulation"
            >
              <MonitorPlay size={14} /> Simulasi
            </button>
            <button
              className={execMode === "hardware" ? "active" : ""}
              onClick={() => setExecMode("hardware")}
              data-testid="exec-mode-hardware"
            >
              <Cpu size={14} /> Perangkat Nyata
            </button>
          </div>
          {execMode === "simulation" ? (
            <SimulationPanel module={module} />
          ) : (
            <SerialPanel code={module.code} />
          )}
        </div>
      </div>

      <div className="detail-footer-grid">
        <div className="challenge-strip" data-testid="detail-challenge">
          <span className="challenge-icon"><Trophy size={16} /></span>
          <div>
            <b>Challenge: {module.challenge}</b>
            <span>Susun ulang eksperimen ini untuk menjawab tantangan.</span>
          </div>
        </div>
        <div className="discovery-strip" data-testid="detail-discovery">
          <span className="discovery-icon"><Sparkles size={16} /></span>
          <div>
            <b>Discovery: catat 3 pola baru</b>
            <span>Tulis apa yang berubah saat kamu mengubah satu variabel.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
