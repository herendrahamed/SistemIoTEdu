import { X, Heart } from "lucide-react";

export function DonationModal({ onClose }) {
  return (
    <div className="modal-backdrop" data-testid="donation-modal" onClick={onClose}>
      <div className="donation-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Tutup donasi" data-testid="donation-modal-close">
          <X size={18} />
        </button>
        <div className="donation-icon"><Heart size={18} fill="currentColor" /></div>
        <h2>Dukung Pembuat Aplikasi</h2>
        <p>Jika ruang belajar ini membantu, dukunganmu sangat berarti. Sifatnya sepenuhnya opsional.</p>
        <div className="qris-placeholder large" data-testid="dashboard-qris-placeholder">
          <div className="qr-grid">▦</div>
          <small>QRIS PLACEHOLDER</small>
        </div>
        <button className="skip-button" onClick={onClose} data-testid="donation-modal-dismiss">
          Tutup untuk kembali belajar
        </button>
      </div>
    </div>
  );
}
