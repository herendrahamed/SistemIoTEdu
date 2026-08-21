import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export function CodePanel({ code, lines }) {
  const [copied, setCopied] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {
      setCopied(false);
    }
  };
  const totalLines = code.split("\n").length;
  return (
    <div className="code-panel" data-testid="code-panel">
      <div className="code-topline">
        <div className="code-tabs">
          <span className="tab active">main.c</span>
          <span className="tab">idf.py build</span>
        </div>
        <button className="code-copy" onClick={copy} data-testid="copy-code-button">
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Tersalin" : "Salin"}
        </button>
      </div>
      <div className="code-body">
        <SyntaxHighlighter
          language="c"
          style={oneLight}
          showLineNumbers
          wrapLines
          lineProps={(lineNumber) => ({
            style: { display: "block", cursor: "pointer", background: lineNumber === activeLine + 1 ? "#fff2e8" : "transparent" },
            onClick: () => setActiveLine(lineNumber - 1),
            "data-testid": `code-line-${lineNumber}`,
          })}
          customStyle={{ margin: 0, padding: "14px 6px 14px 0", background: "#fdfaf7", fontSize: 12.5, lineHeight: 1.55 }}
          codeTagProps={{ style: { fontFamily: '"JetBrains Mono", monospace', fontSize: 12.5 } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      <div className="code-explain" data-testid="code-explain">
        <span className="explain-line">BARIS {String(activeLine + 1).padStart(2, "0")} / {String(totalLines).padStart(2, "0")}</span>
        <p data-testid="code-explanation">
          {lines[activeLine] ? lines[activeLine] : "Baris ini kosong — biasanya untuk memisahkan bagian kode supaya lebih mudah dibaca."}
        </p>
        <small>Klik baris kode mana pun untuk melihat penjelasannya.</small>
      </div>
    </div>
  );
}
