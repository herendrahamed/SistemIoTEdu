import { ChevronDown, ChevronRight, Compass, FlaskConical, Lightbulb, Heart, X, Zap } from "lucide-react";
import { curriculumData } from "@/curriculumData";
import { playgroundData } from "@/playgroundData";

function BookIcon() { return <Lightbulb size={14} />; }

function CurriculumNav({ id, openSection, setOpenSection, activeLesson, selectLesson }) {
  const total = curriculumData.reduce((sum, item) => sum + item.lessons.length, 0);
  return (
    <>
      <div className="sidebar-caption" data-testid={`${id}curriculum-label`}>KURIKULUM RESMI</div>
      <nav className="curriculum-nav" data-testid={`${id}curriculum-navigation`}>
        {curriculumData.map((section, index) => (
          <div className="curriculum-section" key={section.title} data-testid={`${id}curriculum-section-${index}`}>
            <button
              className={`section-trigger ${openSection === index ? "is-open" : ""}`}
              onClick={() => setOpenSection(openSection === index ? -1 : index)}
              data-testid={`${id}curriculum-toggle-${index}`}
              aria-expanded={openSection === index}
            >
              <span className="section-number">
                {section.level === "0" ? <Compass size={14} /> : section.level}
              </span>
              <span className="section-copy">
                <b>{section.title}</b>
                <small>{section.tag} · {section.lessons.length} materi</small>
              </span>
              <ChevronDown size={16} className="chevron" />
            </button>
            {openSection === index && (
              <div className="lesson-list" data-testid={`${id}lesson-list-${index}`}>
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className={`lesson-link ${activeLesson.id === lesson.id ? "active" : ""}`}
                    onClick={() => selectLesson(lesson, index)}
                    data-testid={`${id}lesson-${lesson.id}`}
                  >
                    <span className="lesson-dot" />
                    {lesson.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer" data-testid={`${id}sidebar-progress`}>
        <div className="progress-heading"><span>PROGRES BELAJAR</span><b>0 / {total}</b></div>
        <div className="progress-track"><span /></div>
        <p>Mulai dari dasar, bangun sesuatu yang nyata.</p>
      </div>
    </>
  );
}

function PlaygroundNav({ id, activeModule, selectModule }) {
  return (
    <nav className="curriculum-nav playground-nav" data-testid={`${id}playground-navigation`}>
      {playgroundData.map((module, index) => (
        <button
          key={module.id}
          className={`playground-module ${activeModule === index ? "active" : ""}`}
          onClick={() => selectModule(index)}
          data-testid={`${id}playground-module-${index}`}
        >
          <span className="module-number">{module.number}</span>
          <span>
            <b>{module.title}</b>
            <small>{module.focus}</small>
          </span>
          <ChevronRight size={14} />
        </button>
      ))}
    </nav>
  );
}

export function Sidebar({ mobile, sidebarOpen, mode, setMode, openSection, setOpenSection, activeLesson, selectLesson, activeModule, selectModule, closeMobile, openDonation }) {
  const id = mobile ? "mobile-" : "";
  const collapsed = !sidebarOpen && !mobile;
  return (
    <aside
      className={`sidebar ${mobile ? "sidebar-mobile" : ""} ${collapsed ? "sidebar-collapsed" : ""}`}
      data-testid={`${id}curriculum-sidebar`}
    >
      <div className="sidebar-brand">
        <div className="brand-mark" data-testid={`${id}brand-mark`} title="Embedded for Kids">
          <Zap size={18} fill="currentColor" />
        </div>
        {!collapsed && (
          <div>
            <strong>Embedded</strong>
            <span>for Kids</span>
          </div>
        )}
        {mobile && (
          <button className="icon-button close-mobile" aria-label="Tutup menu" data-testid="close-mobile-menu" onClick={closeMobile}>
            <X size={20} />
          </button>
        )}
      </div>

      {collapsed ? (
        <div className="sidebar-collapsed-nav" data-testid="collapsed-nav">
          <button
            className={`collapsed-tab ${mode === "curriculum" ? "active" : ""}`}
            onClick={() => setMode("curriculum")}
            aria-label="Kurikulum Akademis"
            data-testid="collapsed-curriculum"
            title="Kurikulum Akademis"
          >
            <BookIcon />
          </button>
          <button
            className={`collapsed-tab ${mode === "playground" ? "active" : ""}`}
            onClick={() => setMode("playground")}
            aria-label="ESP32 Playground"
            data-testid="collapsed-playground"
            title="ESP32 Playground"
          >
            <FlaskConical size={14} />
          </button>
          <button
            className="collapsed-tab donate"
            onClick={openDonation}
            aria-label="Donasi QRIS"
            data-testid="collapsed-donation"
            title="Donasi QRIS"
          >
            <Heart size={14} fill="currentColor" />
          </button>
        </div>
      ) : (
        <>
          <div className="mode-switch" data-testid={`${id}mode-switch`}>
            <button
              className={mode === "curriculum" ? "selected" : ""}
              onClick={() => setMode("curriculum")}
              data-testid={`${id}curriculum-mode-tab`}
            >
              <BookIcon />Kurikulum Akademis
            </button>
            <button
              className={mode === "playground" ? "selected" : ""}
              onClick={() => setMode("playground")}
              data-testid={`${id}playground-mode-tab`}
            >
              <FlaskConical size={14} />ESP32 Playground
            </button>
          </div>
          {mode === "curriculum" ? (
            <CurriculumNav id={id} openSection={openSection} setOpenSection={setOpenSection} activeLesson={activeLesson} selectLesson={selectLesson} />
          ) : (
            <PlaygroundNav id={id} activeModule={activeModule} selectModule={selectModule} />
          )}
          <button className="sidebar-donation-button" onClick={openDonation} data-testid={`${id}sidebar-donation`}>
            <Heart size={13} fill="currentColor" />
            <span>Donasi QRIS Sukarela</span>
          </button>
        </>
      )}
    </aside>
  );
}
