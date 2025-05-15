import React, { useState, useRef } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [text, setText] = useState("");
  const [showCheat, setShowCheat] = useState(false);
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

  const SymbolRow = ({ symbol1, desc1, symbol2, desc2 }) => (
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
      <div className="d-flex align-items-center mb-2">
        <h6 className="mb-0 text-muted">Logic Formula Editor</h6>
        <small className="text-muted ms-2">(hover symbols for descriptions)</small>
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

        {/* Symbols in 2 columns */}
        <div style={{ width: '150px' }} className="mt-2 mt-lg-0">
          <table className="table table-sm mb-0 small">
            <tbody style={{ 
              lineHeight: 1,
              verticalAlign: 'middle'
            }}>
              <SymbolRow symbol1="∧" desc1="AND" symbol2="⊗" desc2="tensor product" />
              <SymbolRow symbol1="∨" desc1="OR" symbol2="⊸" desc2="linear implication" />
              <SymbolRow symbol1="¬" desc1="NOT" symbol2="⊥" desc2="perpendicular/tack" />
              <SymbolRow symbol1="→" desc1="implies" symbol2="⅋" desc2="par" />
              <SymbolRow symbol1="↔" desc1="if and only if" symbol2="⊕" desc2="plus/direct sum" />
              <SymbolRow symbol1="∀" desc1="for all" symbol2="!" desc2="of course/bang" />
              <SymbolRow symbol1="∃" desc1="there exists" symbol2="?" desc2="why not/question" />
              <SymbolRow symbol1="=" desc1="equals" symbol2="∈" desc2="element of" />
              <SymbolRow symbol1="≠" desc1="not equal" symbol2="∉" desc2="not element of" />
              <SymbolRow symbol1="≤" desc1="less than or equal" symbol2="⊆" desc2="subset" />
              <SymbolRow symbol1="≥" desc1="greater than or equal" symbol2="⊇" desc2="superset" />
              <SymbolRow symbol1="$" desc1="math delimiter" symbol2=" " desc2="" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
