import { useEffect, useState } from "react";
import { ArrowLeft, Cpu } from "lucide-react";
import { tutorialSteps } from "@/playgroundData";
import { useAdmin } from "@/hooks/useAdmin";
import { getOverride, setOverride, resolveField } from "@/utils/overrides";
import { CodeViewer } from "@/components/CodeViewer";
import { LiveEditor } from "@/components/LiveEditor";
import { SchematicPanel } from "@/components/SchematicPanel";
import { EditableText } from "@/components/EditableText";

export function PlaygroundDetail({ module, onBack }) {
  const admin = useAdmin();
  const [activeTutorial, setActiveTutorial] = useState("Do");
  const [title, setTitle] = useState(() => resolveField(module.title, `modules.${module.id}.title`));
  const [focus, setFocus] = useState(() => resolveField(module.focus, `modules.${module.id}.focus`));
  const [tutorial, setTutorial] = useState(() => {
    const stored = getOverride(`modules.${module.id}.tutorial`);
    return stored && typeof stored === "object" ? { ...module.tutorial, ...stored } : module.tutorial;
  });

  useEffect(() => {
    setTitle(resolveField(module.title, `modules.${module.id}.title`));
    setFocus(resolveField(module.focus, `modules.${module.id}.focus`));
    const stored = getOverride(`modules.${module.id}.tutorial`);
    setTutorial(stored && typeof stored === "object" ? { ...module.tutorial, ...stored } : module.tutorial);
  }, [module.id, module.title, module.focus, module.tutorial]);

  const updateTitle = (next) => {
    setTitle(next);
    setOverride(`modules.${module.id}.title`, next);
  };
  const updateFocus = (next) => {
    setFocus(next);
    setOverride(`modules.${module.id}.focus`, next);
  };
  const updateTutorial = (step, value) => {
    const next = { ...tutorial, [step]: value };
    setTutorial(next);
    setOverride(`modules.${module.id}.tutorial`, next);
  };

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
          <EditableText
            isAdmin={admin}
            value={title}
            onChange={updateTitle}
            className="detail-title-input"
            data-testid="detail-title-editable"
            as="span"
          />
          <br />
          <em>
            <EditableText
              isAdmin={admin}
              value={focus}
              onChange={updateFocus}
              className="detail-focus-input"
              data-testid="detail-focus-editable"
              as="span"
            />
            .
          </em>
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
        <EditableText
          isAdmin={admin}
          value={tutorial[activeTutorial] || ""}
          onChange={(next) => updateTutorial(activeTutorial, next)}
          multiline
          rows={3}
          className="tutorial-copy-input"
          data-testid="tutorial-copy"
          as="p"
        />
      </div>

      <div className="detail-grid">
        <div className="detail-column left-column">
          <div className="column-heading">
            <b>SKEMA RANGKAIAN</b>
          </div>
          <SchematicPanel module={module} />
          <div className="column-heading">
            <b>KODE C / ESP-IDF {admin ? "· EDITABLE (ADMIN)" : "· READ ONLY"}</b>
            <span>{admin ? "Ubah kode dan penjelasan tiap baris di sini" : "Klik baris kode untuk membaca penjelasannya"}</span>
          </div>
          <CodeViewer module={module} />
        </div>
        <div className="detail-column right-column">
          <div className="column-heading">
            <b>EDITOR & TERMINAL</b>
            <span>Tulis kode kamu sendiri, flash ke ESP32, lihat outputnya di terminal</span>
          </div>
          <LiveEditor module={module} />
        </div>
      </div>
    </section>
  );
}
