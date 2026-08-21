import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, ImagePlus, Maximize2, Lock } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { getOverride, setOverride } from "@/utils/overrides";
import { EditableText } from "@/components/EditableText";

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
  const admin = useAdmin();
  const [image, setImage] = useState(() => loadSchematic(module.id));
  const [zoom, setZoom] = useState(false);
  const [caption, setCaption] = useState(() =>
    getOverride(`modules.${module.id}.schematicCaption`) ??
    "Unggah gambar perkawatan (LED, resistor, sensor, dst) yang menyambung ke pin ESP32. Format PNG / JPG.",
  );
  const inputRef = useRef(null);

  useEffect(() => {
    setImage(loadSchematic(module.id));
    setZoom(false);
    setCaption(
      getOverride(`modules.${module.id}.schematicCaption`) ??
        "Unggah gambar perkawatan (LED, resistor, sensor, dst) yang menyambung ke pin ESP32. Format PNG / JPG.",
    );
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

  const updateCaption = (next) => {
    setCaption(next);
    setOverride(`modules.${module.id}.schematicCaption`, next);
  };

  return (
    <div className="schematic-panel" data-testid="schematic-panel">
      <div className="schematic-topline">
        <b>SKEMA RANGKAIAN {admin && <span className="admin-inline-pill">ADMIN</span>}</b>
        {admin && (
          <div className="schematic-actions" data-testid="schematic-admin-actions">
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
        )}
      </div>

      <div className={`schematic-canvas ${image ? "has-image" : "empty"}`} data-testid="schematic-canvas">
        {image ? (
          <img
            src={image}
            alt={`Skema ${module.title}`}
            data-testid="schematic-image"
            onClick={() => setZoom(true)}
          />
        ) : (
          <div className="schematic-placeholder" data-testid="schematic-placeholder">
            <div className="placeholder-icon">{admin ? <ImagePlus size={28} /> : <Lock size={22} />}</div>
            <b>{admin ? "Belum ada gambar skema" : "Skema belum tersedia"}</b>
            {admin ? (
              <>
                <span>{caption}</span>
                <label className="schematic-upload primary" data-testid="schematic-upload-cta">
                  <Upload size={13} />
                  <span>Pilih Gambar</span>
                  <input type="file" accept="image/*" onChange={onFile} hidden />
                </label>
              </>
            ) : (
              <span>Admin akan mengunggah gambar rangkaiannya di sini.</span>
            )}
          </div>
        )}
      </div>

      {(admin || (image && caption)) && (
        <div className="schematic-hint" data-testid="schematic-hint">
          <b>KETERANGAN GAMBAR</b>
          <EditableText
            isAdmin={admin}
            value={caption}
            onChange={updateCaption}
            multiline
            rows={2}
            className="schematic-caption"
            data-testid="schematic-caption"
            as="span"
          />
        </div>
      )}

      {zoom && image && (
        <div className="schematic-lightbox" onClick={() => setZoom(false)} data-testid="schematic-lightbox">
          <img src={image} alt={`Skema ${module.title} diperbesar`} />
        </div>
      )}
    </div>
  );
}
