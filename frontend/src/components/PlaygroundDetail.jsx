import { useState } from "react";
import { ArrowLeft, Cpu } from "lucide-react";
import { tutorialSteps } from "@/playgroundData";
import { CodeEditor } from "@/components/CodeEditor";
import { SchematicPanel } from "@/components/SchematicPanel";

export function PlaygroundDetail({ module, onBack }) {
  const [activeTutorial, setActiveTutorial] = useState("Do");

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
            <b>KODE C / ESP-IDF · EDITABLE</b>
            <span>Ubah kode langsung lalu flash ke ESP32 nyata</span>
          </div>
          <CodeEditor module={module} />
        </div>
        <div className="detail-column runtime-column">
          <div className="column-heading">
            <b>SKEMA RANGKAIAN</b>
            <span>Unggah gambar perkawatan komponen ke pin ESP32</span>
          </div>
          <SchematicPanel module={module} />
        </div>
      </div>
    </section>
  );
}
