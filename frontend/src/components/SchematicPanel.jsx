import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, ImagePlus, Maximize2 } from "lucide-react";

const STORAGE_KEY = "embedded-for-kids-schematics";

function loadSchematic(moduleId) {
  try {
    const map = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
    return map[moduleId];
  } catch {
    return undefined;
  }
}

function saveSchematic(moduleId, dataUrl) {
  try {
    const map = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
    if (dataUrl) map[moduleId] = dataUrl;
    else delete map[moduleId];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota / json errors
  }
}

export function SchematicPanel({ module }) {
  const [image, setImage] = useState(() => loadSchematic(module.id));
  const [zoom, setZoom] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setImage(loadSchematic(module.id));
    setZoom(false);
  }, [module.id]);

  const onFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setImage(dataUrl);
      saveSchematic(module.id, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setImage(undefined);
    saveSchematic(module.id, undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="schematic-panel" data-testid="schematic-panel">
      <div className="schematic-topline">
        <b>SKEMA RANGKAIAN</b>
        <div className="schematic-actions">
          <label className="schematic-upload" data-testid="schematic-upload-label">
            <Upload size={12} />
            <span>{image ? "Ganti gambar" : "Unggah skema"}</span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onFile}
              hidden
              data-testid="schematic-upload-input"
            />
          </label>
          {image && (
            <>
              <button className="schematic-btn" onClick={() => setZoom(true)} data-testid="schematic-zoom-button">
                <Maximize2 size={12} /> Perbesar
              </button>
              <button className="schematic-btn danger" onClick={clear} data-testid="schematic-clear-button">
                <Trash2 size={12} /> Hapus
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`schematic-canvas ${image ? "has-image" : "empty"}`} data-testid="schematic-canvas">
        {image ? (
          <img src={image} alt={`Skema ${module.title}`} data-testid="schematic-image" onClick={() => setZoom(true)} />
        ) : (
          <div className="schematic-placeholder" data-testid="schematic-placeholder">
            <div className="placeholder-icon"><ImagePlus size={28} /></div>
            <b>Belum ada gambar skema</b>
            <span>Unggah gambar perkawatan (LED, resistor, sensor, dst) yang menyambung ke pin ESP32. Format PNG / JPG.</span>
            <label className="schematic-upload primary" data-testid="schematic-upload-cta">
              <Upload size={13} />
              <span>Pilih Gambar</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                hidden
              />
            </label>
          </div>
        )}
      </div>

      <div className="schematic-hint" data-testid="schematic-hint">
        <b>Rangkai Sesuai Kode</b>
        <span>Pastikan pin yang kamu tuliskan di editor cocok dengan pin di gambar. Salah pin = perangkat tidak merespon.</span>
      </div>

      {zoom && image && (
        <div className="schematic-lightbox" onClick={() => setZoom(false)} data-testid="schematic-lightbox">
          <img src={image} alt={`Skema ${module.title} diperbesar`} />
        </div>
      )}
    </div>
  );
}
