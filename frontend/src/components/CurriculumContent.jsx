import { Code2, Play } from "lucide-react";
import { curriculumData, initialLesson } from "@/curriculumData";

export function CurriculumContent({ activeLesson, activeLevel, selectLesson }) {
  const hasSelectedLesson = activeLesson.id !== initialLesson.id;
  return (
    <section className={`content-wrap ${hasSelectedLesson ? "lesson-mode" : ""}`} data-testid="lesson-content">
      {hasSelectedLesson ? (
        <>
          <div className="eyebrow" data-testid="lesson-status">
            <span className="status-dot" /> LEVEL {activeLevel} <i>•</i> {curriculumData[activeLevel].tag.toUpperCase()}
          </div>
          <h1 className="lesson-heading" data-testid="lesson-title">{activeLesson.name}</h1>
          <p className="intro" data-testid="lesson-intro">{activeLesson.description}</p>
          <div className="lesson-context" data-testid="lesson-context">
            <span className="context-icon"><Code2 size={19} /></span>
            <div>
              <b>{curriculumData[activeLevel].title}</b>
              <span>{curriculumData[activeLevel].description}</span>
            </div>
          </div>
          <div className="content-divider" />
          <article className="lesson-article" data-testid="lesson-article">
            <div className="preview-label">RINGKASAN MATERI</div>
            <h2>Yang akan kamu pelajari</h2>
            <p>
              Materi ini membantumu menghubungkan konsep dasar dengan praktik. Baca perlahan, coba contoh kecilnya,
              lalu lanjutkan ke materi berikutnya saat kamu siap.
            </p>
            <button className="text-action" data-testid="continue-lesson-button">
              <Play size={14} fill="currentColor" /> Mulai belajar
            </button>
          </article>
        </>
      ) : (
        <>
          <div className="eyebrow" data-testid="lesson-status">
            <span className="status-dot" /> MULAI PERJALANANMU <i>•</i> EMBEDDED FOR KIDS
          </div>
          <h1 data-testid="lesson-title">
            Mulai dari rasa ingin tahu.<br /><em>Bangun dari nol.</em>
          </h1>
          <p className="intro" data-testid="lesson-intro">
            Selamat datang di Embedded for Kids — ruang belajar untuk memahami cara kerja benda-benda pintar, satu
            baris kode pada satu waktu.
          </p>
          <div className="welcome-strip" data-testid="welcome-strip">
            <div className="strip-icon"><Code2 size={21} /></div>
            <div>
              <b>Siap membuat LED berkedip?</b>
              <span>Pilih materi pertama di sidebar untuk mulai belajar.</span>
            </div>
            <button
              className="round-action"
              data-testid="start-lesson-button"
              onClick={() => selectLesson(initialLesson, 0)}
              aria-label="Mulai pelajaran pertama"
            >
              <Play size={16} fill="currentColor" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
