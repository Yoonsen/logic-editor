import React, { useState } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function App() {
  const [text, setText] = useState(
    "Truth is what we condition on: p(x | C) = p(x | y, C) implies y is irrelevant."
  );

  const renderMath = (input) => {
    const parts = input.split(/(\${1,2}[^$]+\${1,2})/g);
    return parts.map((part, i) => {
      const inlineMatch = part.match(/^\$(.+)\$$/);
      const blockMatch = part.match(/^\$\$(.+)\$\$$/);
      if (blockMatch) return <BlockMath key={i}>{blockMatch[1]}</BlockMath>;
      if (inlineMatch) return <InlineMath key={i}>{inlineMatch[1]}</InlineMath>;
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">🧠 Logic Editor (KaTeX)</h1>
      <textarea
        className="w-full h-40 p-2 mb-4 border border-gray-300 rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write text with $inline$ or $$block$$ math."
      />
      <div className="prose prose-lg">{renderMath(text)}</div>
    </div>
  );
}
