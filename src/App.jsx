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

  const SymbolRow = ({ symbol1, desc1, symbol2, desc2, symbol3, desc3 }) => (
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

        {/* Symbols in 3 columns */}
        <div style={{ width: '225px' }} className="mt-2 mt-lg-0">
          <table className="table table-sm mb-0 small">
            <tbody style={{ 
              lineHeight: 1,
              verticalAlign: 'middle'
            }}>
              <SymbolRow symbol1="∧" desc1="AND" symbol2="⋂" desc2="intersection" symbol3="α" desc3="alpha" />
              <SymbolRow symbol1="∨" desc1="OR" symbol2="⋃" desc2="union" symbol3="β" desc3="beta" />
              <SymbolRow symbol1="¬" desc1="NOT" symbol2="⊥" desc2="perpendicular/tack" symbol3="γ" desc3="gamma" />
              <SymbolRow symbol1="→" desc1="implies" symbol2="⊂" desc2="proper subset" symbol3="δ" desc3="delta" />
              <SymbolRow symbol1="↔" desc1="if and only if" symbol2="⊃" desc2="proper superset" symbol3="ε" desc3="epsilon" />
              <SymbolRow symbol1="∀" desc1="for all" symbol2="!" desc2="of course/bang" symbol3="λ" desc3="lambda" />
              <SymbolRow symbol1="∃" desc1="there exists" symbol2="?" desc2="why not/question" symbol3="μ" desc3="mu" />
              <SymbolRow symbol1="=" desc1="equals" symbol2="∈" desc2="element of" symbol3="π" desc3="pi" />
              <SymbolRow symbol1="≠" desc1="not equal" symbol2="∉" desc2="not element of" symbol3="σ" desc3="sigma" />
              <SymbolRow symbol1="≤" desc1="less than or equal" symbol2="⊆" desc2="subset" symbol3="φ" desc3="phi" />
              <SymbolRow symbol1="≥" desc1="greater than or equal" symbol2="⊇" desc2="superset" symbol3="ψ" desc3="psi" />
              <SymbolRow symbol1="⊗" desc1="tensor product" symbol2="⊸" desc2="linear implication" symbol3="⅋" desc3="par" />
              <SymbolRow symbol1="$" desc1="math delimiter" symbol2=" " desc2="" symbol3="ω" desc3="omega" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
