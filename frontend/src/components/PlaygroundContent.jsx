import { useEffect, useState } from "react";
import { ChevronRight, FlaskConical, Lightbulb } from "lucide-react";
import { playgroundSteps, playgroundStepCopy } from "@/playgroundData";
import { useAdmin } from "@/hooks/useAdmin";
import { getOverride, setOverride, resolveField } from "@/utils/overrides";
import { EditableText } from "@/components/EditableText";

export function PlaygroundContent({ module, activeStep, setActiveStep, onOpenDetail }) {
  const admin = useAdmin();
  const isBreak = activeStep === "Break";
  const litSteps = ["Try", "Build", "Discover"];
  const [title, setTitle] = useState(() => resolveField(module.title, `modules.${module.id}.title`));
  const [focus, setFocus] = useState(() => resolveField(module.focus, `modules.${module.id}.focus`));
  const [stepCopy, setStepCopy] = useState(() => {
    const stored = getOverride(`playgroundSteps`);
    return stored && typeof stored === "object" ? { ...playgroundStepCopy, ...stored } : playgroundStepCopy;
  });

  useEffect(() => {
    setTitle(resolveField(module.title, `modules.${module.id}.title`));
    setFocus(resolveField(module.focus, `modules.${module.id}.focus`));
  }, [module.id, module.title, module.focus]);

  const updateTitle = (next) => {
    setTitle(next);
    setOverride(`modules.${module.id}.title`, next);
  };
  const updateFocus = (next) => {
    setFocus(next);
    setOverride(`modules.${module.id}.focus`, next);
  };
  const updateStepCopy = (step, value) => {
    const next = { ...stepCopy, [step]: value };
    setStepCopy(next);
    setOverride(`playgroundSteps`, next);
  };

  return (
    <section className="content-wrap playground-content compact-top" data-testid="playground-content">
      <div className="playground-kicker">
        <span className="sparkle-mark"><FlaskConical size={16} /></span>
        ESP32 PLAYGROUND <i>•</i> EXPERIMENT {module.number}
      </div>
      <h1 className="playground-title" data-testid="playground-title">
        <EditableText
          isAdmin={admin}
          value={title}
          onChange={updateTitle}
          className="summary-title-input"
          data-testid="summary-title-editable"
          as="span"
        />
        <br />
        <em>buat, rusak, ulangi.</em>
      </h1>
      <p className="intro" data-testid="playground-intro">
        <EditableText
          isAdmin={admin}
          value={focus}
          onChange={updateFocus}
          className="summary-focus-input"
          data-testid="summary-focus-editable"
          as="span"
        />
        . Ruang eksperimen ini membantumu belajar dengan cara mencoba langsung, bukan hanya membaca.
      </p>
      <div className="experiment-card" data-testid="experiment-card">
        <div className="experiment-topline">
          <span>DO → SEE → UNDERSTAND</span>
          <b>LAB / {module.number}</b>
        </div>
        <div className="step-tabs" data-testid="playground-step-tabs">
          {playgroundSteps.map((step) => (
            <button
              key={step}
              className={activeStep === step ? "active" : ""}
              onClick={() => setActiveStep(step)}
              data-testid={`playground-step-${step.toLowerCase()}`}
            >
              {step}
            </button>
          ))}
        </div>
        <div className="experiment-body" data-testid="experiment-body">
          <div className="experiment-visual">
            <div className={`signal ${isBreak ? "broken" : ""}`}>
              <Lightbulb size={42} fill={litSteps.includes(activeStep) ? "currentColor" : "none"} />
            </div>
            <span>{isBreak ? "ERROR / coba lagi" : activeStep === "See" ? "signal terlihat" : "simulasi aktif"}</span>
          </div>
          <div className="experiment-copy">
            <div className="step-label">{activeStep.toUpperCase()}</div>
            <h2>{activeStep === "Challenge" ? module.challenge : `${activeStep} it: ${title}`}</h2>
            <EditableText
              isAdmin={admin}
              value={stepCopy[activeStep] || ""}
              onChange={(next) => updateStepCopy(activeStep, next)}
              multiline
              rows={3}
              className="summary-step-input"
              data-testid="summary-step-copy"
              as="p"
            />
            <button className="experiment-action" onClick={onOpenDetail} data-testid="open-playground-detail">
              Buka lab interaktif <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
