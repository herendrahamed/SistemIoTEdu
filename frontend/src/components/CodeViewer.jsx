import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, RotateCcw } from "lucide-react";

export function CodeViewer({ module }) {
  const [activeLine, setActiveLine] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveLine(0);
  }, [module.id]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(module.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const totalLines = module.code.split("\n").length;
  const explanation = module.lines[activeLine];

  return (
    <div className="code-editor-wrap" data-testid="code-viewer-wrap">
      <div className="code-editor-topline">
        <div className="code-tabs">
          <span className="tab active">main.c</span>
          <span className="tab">read only</span>
        </div>
        <div className="code-editor-actions">
          <button className="code-copy" onClick={() => setActiveLine(0)} data-testid="viewer-reset-button">
            <RotateCcw size={12} /> Reset
          </button>
          <button className="code-copy" onClick={copy} data-testid="viewer-copy-button">
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      <div className="code-viewer-shell" data-testid="code-viewer-shell">
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
          {module.code}
        </SyntaxHighlighter>
      </div>

      <div className="code-explain-panel" data-testid="code-explain-panel">
        <div className="code-explain-head">
          <span className="explain-line">
            BARIS {String(activeLine + 1).padStart(2, "0")} / {String(totalLines).padStart(2, "0")}
          </span>
          <small>Klik baris kode mana pun untuk melihat penjelasannya.</small>
        </div>
        <p data-testid="code-explanation">
          {explanation ||
            "Baris ini kosong — biasanya untuk memisahkan bagian kode supaya lebih mudah dibaca."}
        </p>
      </div>
    </div>
  );
}
