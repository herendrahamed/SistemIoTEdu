import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, RotateCcw, Shield } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { getOverride, setOverride, resolveField } from "@/utils/overrides";
import { EditableText } from "@/components/EditableText";

export function CodeViewer({ module }) {
  const admin = useAdmin();
  const [activeLine, setActiveLine] = useState(0);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState(() => resolveField(module.code, `modules.${module.id}.code`));
  const [explanations, setExplanations] = useState(() => {
    const stored = getOverride(`modules.${module.id}.lines`);
    return Array.isArray(stored) ? stored : module.lines;
  });

  useEffect(() => {
    setActiveLine(0);
    setCode(resolveField(module.code, `modules.${module.id}.code`));
    const stored = getOverride(`modules.${module.id}.lines`);
    setExplanations(Array.isArray(stored) ? stored : module.lines);
  }, [module.id, module.code, module.lines]);

  const updateCode = (next) => {
    setCode(next);
    setOverride(`modules.${module.id}.code`, next);
  };

  const updateExplanation = (index, value) => {
    const next = [...explanations];
    while (next.length <= index) next.push("");
    next[index] = value;
    setExplanations(next);
    setOverride(`modules.${module.id}.lines`, next);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const totalLines = code.split("\n").length;
  const explanation = explanations[activeLine] || "";

  return (
    <div className="code-editor-wrap" data-testid="code-viewer-wrap">
      <div className="code-editor-topline">
        <div className="code-tabs">
          <span className="tab active">main.c</span>
          <span className="tab">{admin ? "editable · admin" : "read only"}</span>
        </div>
        <div className="code-editor-actions">
          {admin && (
            <span className="admin-pill" title="Mode admin aktif" data-testid="viewer-admin-badge">
              <Shield size={11} /> ADMIN
            </span>
          )}
          <button className="code-copy" onClick={() => setActiveLine(0)} data-testid="viewer-reset-button">
            <RotateCcw size={12} /> Reset
          </button>
          <button className="code-copy" onClick={copy} data-testid="viewer-copy-button">
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      <div className="code-viewer-shell" data-testid="code-viewer-shell">
        {admin ? (
          <Editor
            value={code}
            onValueChange={updateCode}
            highlight={(source) => Prism.highlight(source, Prism.languages.c, "c")}
            padding={{ top: 14, bottom: 20, left: 12, right: 12 }}
            textareaClassName="code-editor-textarea admin-code-textarea"
            preClassName="code-editor-pre"
            data-testid="viewer-admin-textarea"
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 13,
              lineHeight: 1.65,
              outline: 0,
              minHeight: 360,
              background: "transparent",
            }}
          />
        ) : (
          <SyntaxHighlighter
            language="c"
            style={oneLight}
            showLineNumbers
            wrapLines
            lineProps={(lineNumber) => ({
              style: {
                display: "block",
                cursor: "pointer",
                background: lineNumber === activeLine + 1 ? "#fff2e8" : "transparent",
                borderLeft:
                  lineNumber === activeLine + 1 ? "3px solid var(--orange)" : "3px solid transparent",
                paddingLeft: 6,
              },
              onClick: () => setActiveLine(lineNumber - 1),
              "data-testid": `code-line-${lineNumber}`,
            })}
            customStyle={{
              margin: 0,
              padding: "16px 8px 16px 0",
              background: "#fdfaf7",
              fontSize: 13,
              lineHeight: 1.65,
            }}
            codeTagProps={{
              style: { fontFamily: '"JetBrains Mono", monospace', fontSize: 13 },
            }}
          >
            {code}
          </SyntaxHighlighter>
        )}
      </div>

      <div className="code-explain-panel" data-testid="code-explain-panel">
        <div className="code-explain-head">
          <span className="explain-line">
            BARIS {String(activeLine + 1).padStart(2, "0")} / {String(totalLines).padStart(2, "0")}
          </span>
          {admin ? (
            <div className="admin-line-nav">
              <button
                type="button"
                onClick={() => setActiveLine(Math.max(0, activeLine - 1))}
                data-testid="viewer-prev-line"
              >
                ‹ prev
              </button>
              <button
                type="button"
                onClick={() => setActiveLine(Math.min(totalLines - 1, activeLine + 1))}
                data-testid="viewer-next-line"
              >
                next ›
              </button>
            </div>
          ) : (
            <small>Klik baris kode mana pun untuk melihat penjelasannya.</small>
          )}
        </div>
        <EditableText
          isAdmin={admin}
          value={explanation}
          onChange={(next) => updateExplanation(activeLine, next)}
          multiline
          rows={3}
          placeholder="Tulis penjelasan baris ini..."
          className="explanation-text"
          data-testid="code-explanation"
          as="p"
        />
      </div>
    </div>
  );
}
