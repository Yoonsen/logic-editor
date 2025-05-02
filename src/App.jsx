import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [text, setText] = useState(
    "Truth is what we condition on: p(x | C) = p(x | y, C) implies y is irrelevant."
  );
  const [showCheat, setShowCheat] = useState(false);

  const renderMath = (input) => {
    const parts = input.split(/(\${1,2}[^$]+?\${1,2})/g);
    return parts.map((part, i) => {
      const block = part.match(/^\$\$(.+)\$\$$/);
      const inline = part.match(/^\$(.+)\$$/);
      if (block) return <BlockMath key={i}>{block[1]}</BlockMath>;
      if (inline) return <InlineMath key={i}>{inline[1]}</InlineMath>;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="container py-5">
      <div className="mx-auto p-4 bg-white rounded shadow" style={{ maxWidth: '800px' }}>
        <h1 className="text-center mb-4">🧠 Logic Editor</h1>

        <div className="mb-4">
          <textarea
            className="form-control"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write text with $inline$ or $$block$$ math."
          />
        </div>

        <div className="border p-3 rounded bg-light mb-4">
          {renderMath(text)}
        </div>

        <div className="text-center mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setShowCheat(!showCheat)}
          >
            {showCheat ? "Hide" : "Show"} Symbol Cheat Sheet
          </button>
        </div>

        {showCheat && (
          <div className="bg-white border p-4 rounded">
            <h5>Logic & Set Theory</h5>
            <ul className="row row-cols-2">
              <li>∈ — element of</li>
              <li>∉ — not an element of</li>
              <li>∧ — logical AND</li>
              <li>∨ — logical OR</li>
              <li>¬ — logical NOT</li>
              <li>→ — implies</li>
              <li>⇒ — strong implication</li>
              <li>↔ — if and only if</li>
              <li>∀ — for all</li>
              <li>∃ — there exists</li>
              <li>⊆ — subset</li>
              <li>⊇ — superset</li>
            </ul>

            <h5 className="mt-3">Comparison</h5>
            <ul className="row row-cols-2">
              <li>≠ — not equal</li>
              <li>≤ — less than or equal</li>
              <li>≥ — greater than or equal</li>
              <li>≡ — identical</li>
              <li>≈ — approximately equal</li>
            </ul>

            <h5 className="mt-3">Typography</h5>
            <ul>
              <li>- — hyphen</li>
              <li>– — en dash (Option + -)</li>
              <li>— — em dash (Shift + Option + -)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
