import React, { useState, useRef } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [text, setText] = useState("");
  const [showCheat, setShowCheat] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleCursorChange = (e) => {
    setCursorPosition(e.target.selectionStart);
  };

  const insertSymbol = (symbol) => {
    const before = text.slice(0, cursorPosition);
    const after = text.slice(cursorPosition);
    const newText = before + symbol + after;
    setText(newText);
    
    // Set focus back to textarea and update cursor position
    const newPosition = cursorPosition + symbol.length;
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newPosition, newPosition);
      setCursorPosition(newPosition);
    }, 0);
  };

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

  const SymbolRow = ({ symbol1, desc1, symbol2, desc2, symbol3, desc3, symbol4, desc4, symbol5, desc5 }) => (
    <tr>
      <td className="text-center p-1">
        <button 
          className="btn btn-outline-secondary btn-sm px-2 py-1"
          onClick={() => insertSymbol(symbol1)}
          title={desc1}
        >
          {symbol1}
        </button>
      </td>
      <td className="text-center p-1">
        <button 
          className="btn btn-outline-secondary btn-sm px-2 py-1"
          onClick={() => insertSymbol(symbol2)}
          title={desc2}
        >
          {symbol2}
        </button>
      </td>
      <td className="text-center p-1">
        <button 
          className="btn btn-outline-secondary btn-sm px-2 py-1"
          onClick={() => insertSymbol(symbol3)}
          title={desc3}
        >
          {symbol3}
        </button>
      </td>
      <td className="text-center p-1">
        <button 
          className="btn btn-outline-secondary btn-sm px-2 py-1"
          onClick={() => insertSymbol(symbol4)}
          title={desc4}
        >
          {symbol4}
        </button>
      </td>
      <td className="text-center p-1">
        <button 
          className="btn btn-outline-secondary btn-sm px-2 py-1"
          onClick={() => insertSymbol(symbol5)}
          title={desc5}
        >
          {symbol5}
        </button>
      </td>
    </tr>
  );

  const copyText = () => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast/notification here if desired
    });
  };

  const copyRendered = () => {
    // Remove LaTeX delimiters and commands to get plain text
    const plainText = text.replace(/\$\$|\$/g, '')  // Remove $$ and $
                         .replace(/\\[a-zA-Z]+/g, '') // Remove LaTeX commands
                         .replace(/[{}]/g, '')        // Remove curly braces
                         .trim();
    navigator.clipboard.writeText(plainText);
  };

  return (
    <div className="container-fluid py-1">
      <div className="mb-2">
        <div 
          className="d-flex align-items-center cursor-pointer user-select-none"
          onClick={() => setShowHelp(!showHelp)}
          style={{ cursor: 'pointer' }}
        >
          <h6 className="mb-0 text-muted">Logic Formula Editor</h6>
          <small className="text-muted ms-2">(hover symbols for descriptions)</small>
          <small className="text-muted ms-2">
            {showHelp ? '▼' : '▶'}
          </small>
        </div>
        {showHelp && (
          <div className="mt-2 small text-muted border-start ps-3">
            This editor helps you write and test logic formulas and LaTeX math expressions. 
            Perfect for trying out formulas before using them in larger documents or editors. 
            Click symbols to insert them, or type directly using LaTeX syntax (e.g., $\forall x$).
            All formulas built with these symbols (without $ delimiters) can be safely pasted into emails, Word, Google Docs, and other text editors.
            LaTeX-rendered formulas (with $ delimiters) are for preview only.
            Use the copy button to transfer your formula elsewhere.
          </div>
        )}
      </div>

      <div className="d-flex flex-column flex-lg-row gap-2">
        {/* Editor Section */}
        <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
          <div className="mb-2">
            <textarea
              ref={textareaRef}
              className="form-control form-control-sm"
              rows={3}
              value={text}
              onChange={handleTextChange}
              onKeyUp={handleCursorChange}
              onClick={handleCursorChange}
              placeholder="Type or paste formula here..."
              style={{ fontSize: '16px' }}  /* Prevents zoom on mobile */
            />
          </div>
          <div className="d-flex gap-2 align-items-start">
            <div 
              className="flex-grow-1 border p-2 rounded bg-light" 
              style={{ 
                minHeight: '3em',
                lineHeight: '1.5',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{ width: '100%', overflowX: 'auto' }}>
                {renderMath(text)}
              </div>
            </div>
            <button 
              className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
              style={{ width: '34px', height: '34px' }}
              onClick={copyText}
              title="Copy formula text"
            >
              📋
            </button>
          </div>
        </div>

        {/* Symbols in 5 columns */}
        <div style={{ width: '280px' }} className="mt-2 mt-lg-0">
          <table className="table table-sm mb-0 small">
            <tbody style={{ 
              lineHeight: 1,
              verticalAlign: 'middle'
            }}>
              <SymbolRow symbol1="∧" desc1="AND" symbol2="⊗" desc2="tensor product" symbol3="α" desc3="alpha" symbol4="∈" desc4="element of" symbol5="⁰" desc5="superscript zero" />
              <SymbolRow symbol1="∨" desc1="OR" symbol2="⊸" desc2="linear implication" symbol3="β" desc3="beta" symbol4="∉" desc4="not element of" symbol5="¹" desc5="superscript one" />
              <SymbolRow symbol1="¬" desc1="NOT" symbol2="⅋" desc2="par" symbol3="γ" desc3="gamma" symbol4="⊂" desc4="proper subset" symbol5="²" desc5="superscript two" />
              <SymbolRow symbol1="→" desc1="implies" symbol2="⊥" desc2="perpendicular/tack" symbol3="δ" desc3="delta" symbol4="⊃" desc4="proper superset" symbol5="³" desc5="superscript three" />
              <SymbolRow symbol1="↔" desc1="if and only if" symbol2="!" desc2="of course/bang" symbol3="ε" desc3="epsilon" symbol4="∅" desc4="empty set" symbol5="⁴" desc5="superscript four" />
              <SymbolRow symbol1="∀" desc1="for all" symbol2="?" desc2="why not/question" symbol3="λ" desc3="lambda" symbol4="ℕ" desc4="natural numbers" symbol5="⁵" desc5="superscript five" />
              <SymbolRow symbol1="∃" desc1="there exists" symbol2="⋂" desc2="intersection" symbol3="μ" desc3="mu" symbol4="ℤ" desc4="integers" symbol5="⁶" desc5="superscript six" />
              <SymbolRow symbol1="=" desc1="equals" symbol2="⋃" desc2="union" symbol3="π" desc3="pi" symbol4="ℚ" desc4="rational numbers" symbol5="⁷" desc5="superscript seven" />
              <SymbolRow symbol1="≠" desc1="not equal" symbol2="∉" desc2="not element of" symbol3="σ" desc3="sigma" symbol4="ℝ" desc4="real numbers" symbol5="⁸" desc5="superscript eight" />
              <SymbolRow symbol1="≤" desc1="less than or equal" symbol2="⊆" desc2="subset" symbol3="φ" desc3="phi" symbol4="ℂ" desc4="complex numbers" symbol5="⁹" desc5="superscript nine" />
              <SymbolRow symbol1="≥" desc1="greater than or equal" symbol2="⊇" desc2="superset" symbol3="ψ" desc3="psi" symbol4="×" desc4="cartesian product" symbol5="ⁿ" desc5="superscript n" />
              <SymbolRow symbol1="$" desc1="math delimiter" symbol2=" " desc2="" symbol3="ω" desc3="omega" symbol4="∖" desc4="set difference" symbol5="ᵐ" desc5="superscript m" />
              <SymbolRow symbol1="ℵ" desc1="aleph" symbol2="ℵ₀" desc2="aleph-null" symbol3="∞" desc3="infinity" symbol4="ℵ₁" desc4="aleph-one" symbol5="ᵏ" desc5="superscript k" />
              <SymbolRow symbol1="ℵ₂" desc1="aleph-two" symbol2="ℵ₃" desc2="aleph-three" symbol3="₀" desc3="subscript zero" symbol4="₁" desc4="subscript one" symbol5="ᵗ" desc5="superscript t" />
              <SymbolRow symbol1="₂" desc1="subscript two" symbol2="₃" desc2="subscript three" symbol3="₄" desc3="subscript four" symbol4="₅" desc4="subscript five" symbol5="ᵈ" desc5="superscript d" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
