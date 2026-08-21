import { UserRound, X } from "lucide-react";
import { useEffect, useRef } from "react";

const placementLabel = {
  Beginner: "Level 0 · Pengantar C/C++",
  Intermediate: "Level 2 · ESP-IDF Scheduler",
  Advanced: "Level 5 · RTOS & Multithread",
  explorer: "Bebas menjelajah semua materi",
};

export function ProfilePopover({ profile, onClose, onReset }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  const label = placementLabel[profile.placement] || "Penjelajah";
  return (
    <div className="profile-popover" data-testid="profile-popover" ref={ref}>
      <div className="profile-popover-head">
        <div className="profile-avatar"><UserRound size={18} /></div>
        <div>
          <b data-testid="profile-name">{profile.name}</b>
          <span>{label}</span>
        </div>
        <button className="popover-close" onClick={onClose} aria-label="Tutup profil" data-testid="profile-popover-close">
          <X size={14} />
        </button>
      </div>
      <div className="profile-progress">
        <span>
          <small>PROGRES BELAJAR</small>
          <b>0%</b>
        </span>
        <div className="progress-track"><span /></div>
        <p>Siap memulai materi pertamamu.</p>
      </div>
      <button className="profile-reset" onClick={onReset} data-testid="profile-reset-button">
        Mulai ulang perjalanan
      </button>
    </div>
  );
}
