import { UserRound, X, Shield } from "lucide-react";
import { useEffect, useRef } from "react";
import { isAdminProfile } from "@/hooks/useAdmin";

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
  const admin = isAdminProfile(profile);
  const label = admin ? "Admin · akses edit penuh" : placementLabel[profile.placement] || "Penjelajah";
  const displayName = admin ? "Herendra (admin)" : profile.name;
  return (
    <div className={`profile-popover ${admin ? "is-admin" : ""}`} data-testid="profile-popover" ref={ref}>
      <div className="profile-popover-head">
        <div className={`profile-avatar ${admin ? "admin" : ""}`}>
          {admin ? <Shield size={18} /> : <UserRound size={18} />}
        </div>
        <div>
          <b data-testid="profile-name">{displayName}</b>
          <span>{label}</span>
        </div>
        <button className="popover-close" onClick={onClose} aria-label="Tutup profil" data-testid="profile-popover-close">
          <X size={14} />
        </button>
      </div>
      {admin && (
        <div className="profile-admin-note" data-testid="profile-admin-note">
          Kamu bisa mengedit judul, deskripsi, kode, penjelasan tiap baris, dan gambar skema langsung di halaman.
        </div>
      )}
      <button className="profile-reset" onClick={onReset} data-testid="profile-reset-button">
        Mulai ulang perjalanan
      </button>
    </div>
  );
}
