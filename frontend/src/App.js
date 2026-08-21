import { useMemo, useState } from "react";
import "@/App.css";
import "@/curriculum-overrides.css";
import "@/playground-overrides.css";
import "@/onboarding.css";
import "@/playground-detail.css";
import { curriculumData, initialLesson } from "@/curriculumData";
import { playgroundData } from "@/playgroundData";
import { Instagram } from "lucide-react";
import { Onboarding } from "@/components/Onboarding";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { DonationModal } from "@/components/DonationModal";
import { ProfilePopover } from "@/components/ProfilePopover";
import { CurriculumContent } from "@/components/CurriculumContent";
import { PlaygroundContent } from "@/components/PlaygroundContent";
import { PlaygroundDetail } from "@/components/PlaygroundDetail";

function useSearchIndex() {
  return useMemo(() => {
    const curriculumEntries = curriculumData.flatMap((section, levelIndex) =>
      section.lessons.map((lesson) => ({
        kind: "lesson",
        key: lesson.id,
        name: lesson.name,
        label: `${section.title} · Level ${section.level}`,
        lesson,
        levelIndex,
      })),
    );
    const playgroundEntries = playgroundData.map((module, index) => ({
      kind: "module",
      key: module.id,
      name: module.title,
      label: `Playground · ${module.focus}`,
      moduleIndex: index,
    }));
    return [...curriculumEntries, ...playgroundEntries];
  }, []);
}

function App() {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("embedded-for-kids-profile"));
    } catch {
      return null;
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState("curriculum");
  const [openSection, setOpenSection] = useState(0);
  const [activeLesson, setActiveLesson] = useState(initialLesson);
  const [activeLevel, setActiveLevel] = useState(0);
  const [activeModule, setActiveModule] = useState(0);
  const [activePlayStep, setActivePlayStep] = useState("Try");
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const searchIndex = useSearchIndex();

  const selectLesson = (lesson, levelIndex) => {
    setActiveLesson(lesson);
    setActiveLevel(levelIndex);
    setMobileOpen(false);
    setSearch("");
    setDetailOpen(false);
    setMode("curriculum");
  };

  const selectModule = (index) => {
    setActiveModule(index);
    setActivePlayStep("Try");
    setMobileOpen(false);
    setSearch("");
    setMode("playground");
  };

  const resetProfile = () => {
    window.localStorage.removeItem("embedded-for-kids-profile");
    window.dispatchEvent(new Event("embedded-profile-change"));
    setProfile(null);
    setProfileOpen(false);
  };

  if (!profile) {
    return (
      <Onboarding
        onComplete={(nextProfile) => {
          window.localStorage.setItem("embedded-for-kids-profile", JSON.stringify(nextProfile));
          window.dispatchEvent(new Event("embedded-profile-change"));
          setProfile(nextProfile);
        }}
      />
    );
  }

  const isPlayground = mode === "playground";
  const module = playgroundData[activeModule];
  const searchTerm = search.trim().toLowerCase();
  const searchResults = searchTerm
    ? searchIndex
        .filter((entry) => `${entry.name} ${entry.label}`.toLowerCase().includes(searchTerm))
        .slice(0, 8)
    : [];

  const onSelectResult = (result) => {
    if (result.kind === "lesson") selectLesson(result.lesson, result.levelIndex);
    else selectModule(result.moduleIndex);
  };

  return (
    <div className="app-shell" data-testid="app-shell">
      <Sidebar
        sidebarOpen={sidebarOpen}
        mode={mode}
        setMode={setMode}
        openSection={openSection}
        setOpenSection={setOpenSection}
        activeLesson={activeLesson}
        selectLesson={selectLesson}
        activeModule={activeModule}
        selectModule={selectModule}
        openDonation={() => setDonationOpen(true)}
      />
      {mobileOpen && (
        <div className="mobile-overlay" data-testid="mobile-overlay" onClick={() => setMobileOpen(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <Sidebar
              mobile
              sidebarOpen={sidebarOpen}
              mode={mode}
              setMode={setMode}
              openSection={openSection}
              setOpenSection={setOpenSection}
              activeLesson={activeLesson}
              selectLesson={selectLesson}
              activeModule={activeModule}
              selectModule={selectModule}
              closeMobile={() => setMobileOpen(false)}
              openDonation={() => { setDonationOpen(true); setMobileOpen(false); }}
            />
          </div>
        </div>
      )}
      <main className="main-area">
        <Header
          detailOpen={detailOpen && isPlayground}
          isPlayground={isPlayground}
          moduleTitle={module.title}
          activeLesson={activeLesson}
          activeLevel={activeLevel}
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          openMobile={() => setMobileOpen(true)}
          search={search}
          setSearch={setSearch}
          searchResults={searchResults}
          onSelectResult={onSelectResult}
          profileOpen={profileOpen}
          toggleProfile={() => setProfileOpen(!profileOpen)}
          openDonation={() => setDonationOpen(true)}
        />
        {profileOpen && (
          <ProfilePopover profile={profile} onClose={() => setProfileOpen(false)} onReset={resetProfile} />
        )}
        {isPlayground && detailOpen ? (
          <PlaygroundDetail module={module} onBack={() => setDetailOpen(false)} />
        ) : isPlayground ? (
          <PlaygroundContent
            module={module}
            activeStep={activePlayStep}
            setActiveStep={setActivePlayStep}
            onOpenDetail={() => setDetailOpen(true)}
          />
        ) : (
          <CurriculumContent
            activeLesson={activeLesson}
            activeLevel={activeLevel}
            selectLesson={selectLesson}
          />
        )}
        <footer className="page-footer" data-testid="app-footer">
          <a
            className="footer-credit"
            href="https://instagram.com/herendrahamed"
            target="_blank"
            rel="noreferrer"
            data-testid="footer-credit"
          >
            <Instagram size={13} />
            <span>Build by <b>@herendrahamed</b></span>
          </a>
          <span className="footer-code">ESP32 <i>×</i> ESP-IDF <i>×</i> curiosity</span>
        </footer>
      </main>
      {donationOpen && <DonationModal onClose={() => setDonationOpen(false)} />}
    </div>
  );
}

export default App;
