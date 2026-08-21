import { ChevronRight, FlaskConical, Lightbulb } from "lucide-react";
import { playgroundSteps, playgroundStepCopy } from "@/playgroundData";

export function PlaygroundContent({ module, activeStep, setActiveStep, onOpenDetail }) {
  const isBreak = activeStep === "Break";
  const litSteps = ["Try", "Build", "Discover"];
  return (
    <section className="content-wrap playground-content compact-top" data-testid="playground-content">
      <div className="playground-kicker">
        <span className="sparkle-mark"><FlaskConical size={16} /></span>
        ESP32 PLAYGROUND <i>•</i> EXPERIMENT {module.number}
      </div>
      <h1 className="playground-title" data-testid="playground-title">
        {module.title}<br /><em>buat, rusak, ulangi.</em>
      </h1>
      <p className="intro" data-testid="playground-intro">
        {module.focus}. Ruang eksperimen ini membantumu belajar dengan cara mencoba langsung, bukan hanya membaca.
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
            <h2>{activeStep === "Challenge" ? module.challenge : `${activeStep} it: ${module.title}`}</h2>
            <p>{playgroundStepCopy[activeStep]}</p>
            <button className="experiment-action" onClick={onOpenDetail} data-testid="open-playground-detail">
              Buka lab interaktif <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
