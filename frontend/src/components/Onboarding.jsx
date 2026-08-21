import { X, ChevronRight, Coffee, Zap } from "lucide-react";
import { useState } from "react";

const placementLevels = [
  ["Beginner", "Pengantar C/C++", "Mulai dari fondasi paling dasar", "0"],
  ["Intermediate", "ESP-IDF Scheduler", "Sudah nyaman dengan dasar coding", "2"],
  ["Advanced", "RTOS & Multithread", "Siap menjinakkan sistem yang berjalan bersamaan", "5"],
];

export function Onboarding({ onComplete }) {
  const [name, setName] = useState("");
  const [placement, setPlacement] = useState("");
  const [showDonation, setShowDonation] = useState(true);
  const [qrisOpen, setQrisOpen] = useState(false);
  const finish = (skip = false) =>
    onComplete({ name: name.trim() || "Penjelajah", placement: skip ? "explorer" : placement });

  return (
    <main className="onboarding-page" data-testid="onboarding-page">
      <div className="onboarding-noise" />
      <div className="onboarding-topline">
        <div className="onboarding-brand">
          <span className="brand-mark"><Zap size={18} fill="currentColor" /></span>
          <span><b>Embedded</b><small>for Kids</small></span>
        </div>
        <span className="onboarding-code">ESP32 / ESP-IDF / 001</span>
      </div>
      <section className="onboarding-content">
        <div className="onboarding-kicker"><span className="status-dot" /> SELAMAT DATANG, PENJELAJAH</div>
        <h1 data-testid="onboarding-title">Belajar dengan<br /><em>rasa ingin tahu.</em></h1>
        <p className="onboarding-intro">Pilih langkah pertama. Sisanya bisa kamu jelajahi sesuka hati — tidak ada jalur yang benar-benar terkunci.</p>
        <label className="name-field" htmlFor="learner-name">
          <span>SIAPA NAMAMU?</span>
          <input id="learner-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Tulis namamu di sini" data-testid="learner-name-input" />
        </label>
        <div className="placement-heading">
          <span>ATUR TITIK MULAI</span>
          <small>Opsional · kamu bebas membuka semua materi</small>
        </div>
        <div className="placement-grid" data-testid="placement-options">
          {placementLevels.map(([title, subtitle, detail, level]) => (
            <button
              key={title}
              className={`placement-card ${placement === title ? "selected" : ""}`}
              onClick={() => setPlacement(title)}
              data-testid={`placement-${title.toLowerCase()}`}
            >
              <span className="placement-level">LEVEL {level}</span>
              <b>{title}</b>
              <strong>{subtitle}</strong>
              <small>{detail}</small>
              {placement === title && <span className="placement-check">✓</span>}
            </button>
          ))}
        </div>
        <div className="onboarding-actions">
          <button className="primary-start" disabled={!name.trim() || !placement} onClick={() => finish()} data-testid="start-learning-button">
            Mulai perjalanan <ChevronRight size={17} />
          </button>
          <button className="skip-button" onClick={() => finish(true)} data-testid="skip-onboarding-button">
            Lewati &amp; mulai belajar
          </button>
        </div>
      </section>
      {showDonation && (
        <aside className="donation-card" data-testid="donation-card">
          <button className="donation-close" onClick={() => setShowDonation(false)} aria-label="Tutup kartu donasi" data-testid="donation-close-button">
            <X size={15} />
          </button>
          <div className="donation-icon"><Coffee size={18} /></div>
          <div>
            <b>Dukung Pembuat Aplikasi</b>
            <span>Bantu kami menciptakan ruang belajar lebih baik dengan melakukan donasi di bawah ini.</span>
          </div>
          <button
            type="button"
            className="qris-placeholder"
            data-testid="qris-placeholder"
            onClick={() => setQrisOpen(true)}
            aria-label="Buka QRIS donasi"
          >
            <div className="qr-grid">▦</div>
            <small>QRIS · KLIK UNTUK PERBESAR</small>
          </button>
        </aside>
      )}
      {qrisOpen && (
        <div className="modal-backdrop" data-testid="onboarding-qris-modal" onClick={() => setQrisOpen(false)}>
          <div className="qris-modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setQrisOpen(false)}
              aria-label="Tutup QRIS"
              data-testid="onboarding-qris-modal-close"
            >
              <X size={18} />
            </button>
            <div className="qris-modal-icon"><Coffee size={22} /></div>
            <div className="qris-modal-big" data-testid="onboarding-qris-large">
              <div className="qr-grid">▦</div>
              <small>QRIS PLACEHOLDER</small>
            </div>
            <h2 data-testid="onboarding-qris-thankyou">thank u for supporting us</h2>
            <p>Terima kasih sudah mendukung kami</p>
          </div>
        </div>
      )}
    </main>
  );
}
