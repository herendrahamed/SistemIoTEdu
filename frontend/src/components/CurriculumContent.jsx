import { useEffect, useState } from "react";
import { Code2, Play } from "lucide-react";
import { curriculumData, initialLesson } from "@/curriculumData";
import { useAdmin } from "@/hooks/useAdmin";
import { getOverride, setOverride, resolveField } from "@/utils/overrides";
import { EditableText } from "@/components/EditableText";

function lessonKey(levelIndex, lessonId) {
  return `lessons.${levelIndex}.${lessonId}`;
}

export function CurriculumContent({ activeLesson, activeLevel, selectLesson }) {
  const admin = useAdmin();
  const hasSelectedLesson = activeLesson.id !== initialLesson.id;
  const [name, setName] = useState(() => resolveField(activeLesson.name, `${lessonKey(activeLevel, activeLesson.id)}.name`));
  const [description, setDescription] = useState(() =>
    resolveField(activeLesson.description || "", `${lessonKey(activeLevel, activeLesson.id)}.description`),
  );
  const [sectionTitle, setSectionTitle] = useState(() =>
    resolveField(curriculumData[activeLevel].title, `levels.${activeLevel}.title`),
  );
  const [sectionDescription, setSectionDescription] = useState(() =>
    resolveField(curriculumData[activeLevel].description, `levels.${activeLevel}.description`),
  );

  useEffect(() => {
    setName(resolveField(activeLesson.name, `${lessonKey(activeLevel, activeLesson.id)}.name`));
    setDescription(resolveField(activeLesson.description || "", `${lessonKey(activeLevel, activeLesson.id)}.description`));
    setSectionTitle(resolveField(curriculumData[activeLevel].title, `levels.${activeLevel}.title`));
    setSectionDescription(resolveField(curriculumData[activeLevel].description, `levels.${activeLevel}.description`));
  }, [activeLesson.id, activeLevel, activeLesson.name, activeLesson.description]);

  const updateName = (next) => {
    setName(next);
    setOverride(`${lessonKey(activeLevel, activeLesson.id)}.name`, next);
  };
  const updateDescription = (next) => {
    setDescription(next);
    setOverride(`${lessonKey(activeLevel, activeLesson.id)}.description`, next);
  };
  const updateSectionTitle = (next) => {
    setSectionTitle(next);
    setOverride(`levels.${activeLevel}.title`, next);
  };
  const updateSectionDescription = (next) => {
    setSectionDescription(next);
    setOverride(`levels.${activeLevel}.description`, next);
  };

  return (
    <section className={`content-wrap ${hasSelectedLesson ? "lesson-mode" : ""}`} data-testid="lesson-content">
      {hasSelectedLesson ? (
        <>
          <div className="eyebrow" data-testid="lesson-status">
            <span className="status-dot" /> LEVEL {activeLevel} <i>•</i> {curriculumData[activeLevel].tag.toUpperCase()}
          </div>
          <h1 className="lesson-heading" data-testid="lesson-title">
            <EditableText
              isAdmin={admin}
              value={name}
              onChange={updateName}
              className="lesson-name-input"
              data-testid="lesson-name-editable"
              as="span"
            />
          </h1>
          <EditableText
            isAdmin={admin}
            value={description}
            onChange={updateDescription}
            multiline
            rows={3}
            placeholder="Deskripsi materi..."
            className="intro"
            data-testid="lesson-intro"
            as="p"
          />
          <div className="lesson-context" data-testid="lesson-context">
            <span className="context-icon"><Code2 size={19} /></span>
            <div>
              <EditableText
                isAdmin={admin}
                value={sectionTitle}
                onChange={updateSectionTitle}
                className="lesson-section-title"
                data-testid="lesson-section-title"
                as="b"
              />
              <EditableText
                isAdmin={admin}
                value={sectionDescription}
                onChange={updateSectionDescription}
                multiline
                rows={2}
                className="lesson-section-description"
                data-testid="lesson-section-description"
                as="span"
              />
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
