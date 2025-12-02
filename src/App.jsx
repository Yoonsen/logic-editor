import React, { useState, useRef, useEffect } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const SYMBOL_COLUMNS = 5;
const FAVORITES_STORAGE_KEY = "logicEditorFavorites";
const SECTION_STATE_STORAGE_KEY = "logicEditorSectionState";
const FAVORITE_SLOTS = 9;

const SYMBOL_SECTIONS = [
  {
    title: "Logic Connectives",
    symbols: [
      { symbol: "∧", desc: "AND" },
      { symbol: "∨", desc: "OR" },
      { symbol: "¬", desc: "NOT" },
      { symbol: "→", desc: "implies" },
      { symbol: "↔", desc: "if and only if" },
      { symbol: "∀", desc: "for all" },
      { symbol: "∃", desc: "there exists" },
      { symbol: "=", desc: "equals" },
      { symbol: "≠", desc: "not equal" },
      { symbol: "≤", desc: "less than or equal" },
      { symbol: "≥", desc: "greater than or equal" },
    ],
  },
  {
    title: "Linear Logic",
    symbols: [
      { symbol: "⊗", desc: "tensor product" },
      { symbol: "⊸", desc: "linear implication" },
      { symbol: "⅋", desc: "par (upside-down &)" },
      { symbol: "⊥", desc: "bottom/tack" },
      { symbol: "!", desc: "of course (bang)" },
      { symbol: "?", desc: "why not" },
      { symbol: "□", desc: "box modality" },
      { symbol: "△", desc: "triangle modality" },
    ],
  },
  {
    title: "Set Theory & Numbers",
    symbols: [
      { symbol: "∈", desc: "element of" },
      { symbol: "∉", desc: "not element of" },
      { symbol: "⊂", desc: "proper subset" },
      { symbol: "⊃", desc: "proper superset" },
      { symbol: "⊆", desc: "subset" },
      { symbol: "⊇", desc: "superset" },
      { symbol: "∅", desc: "empty set" },
      { symbol: "ℕ", desc: "natural numbers" },
      { symbol: "ℤ", desc: "integers" },
      { symbol: "ℚ", desc: "rational numbers" },
      { symbol: "ℝ", desc: "real numbers" },
      { symbol: "ℂ", desc: "complex numbers" },
      { symbol: "⋂", desc: "intersection" },
      { symbol: "⋃", desc: "union" },
      { symbol: "×", desc: "cartesian product" },
      { symbol: "∖", desc: "set difference" },
    ],
  },
  {
    title: "Greek Letters & Constants",
    symbols: [
      { symbol: "α", desc: "alpha" },
      { symbol: "β", desc: "beta" },
      { symbol: "γ", desc: "gamma" },
      { symbol: "δ", desc: "delta" },
      { symbol: "ε", desc: "epsilon" },
      { symbol: "λ", desc: "lambda" },
      { symbol: "μ", desc: "mu" },
      { symbol: "π", desc: "pi" },
      { symbol: "σ", desc: "sigma" },
      { symbol: "φ", desc: "phi" },
      { symbol: "ψ", desc: "psi" },
      { symbol: "ω", desc: "omega" },
      { symbol: "∞", desc: "infinity" },
    ],
  },
  {
    title: "Cardinalities",
    symbols: [
      { symbol: "ℵ", desc: "aleph" },
      { symbol: "ℵ₀", desc: "aleph-null" },
      { symbol: "ℵ₁", desc: "aleph-one" },
      { symbol: "ℵ₂", desc: "aleph-two" },
      { symbol: "ℵ₃", desc: "aleph-three" },
    ],
  },
  {
    title: "Superscripts",
    symbols: [
      { symbol: "⁰", desc: "superscript zero" },
      { symbol: "¹", desc: "superscript one" },
      { symbol: "²", desc: "superscript two" },
      { symbol: "³", desc: "superscript three" },
      { symbol: "⁴", desc: "superscript four" },
      { symbol: "⁵", desc: "superscript five" },
      { symbol: "⁶", desc: "superscript six" },
      { symbol: "⁷", desc: "superscript seven" },
      { symbol: "⁸", desc: "superscript eight" },
      { symbol: "⁹", desc: "superscript nine" },
      { symbol: "ⁿ", desc: "superscript n" },
      { symbol: "ᵐ", desc: "superscript m" },
      { symbol: "ᵏ", desc: "superscript k" },
      { symbol: "ᵗ", desc: "superscript t" },
      { symbol: "ᵈ", desc: "superscript d" },
    ],
  },
  {
    title: "Subscripts",
    symbols: [
      { symbol: "₀", desc: "subscript zero" },
      { symbol: "₁", desc: "subscript one" },
      { symbol: "₂", desc: "subscript two" },
      { symbol: "₃", desc: "subscript three" },
      { symbol: "₄", desc: "subscript four" },
      { symbol: "₅", desc: "subscript five" },
    ],
  },
  {
    title: "Delimiters",
    symbols: [
      { symbol: "$", desc: "math delimiter" },
      { symbol: "–", desc: "en dash" },
      { symbol: "—", desc: "em dash" },
    ],
  },
  {
    title: "Currency & Special",
    symbols: [
      { symbol: "£", desc: "pound sterling" },
      { symbol: "€", desc: "euro" },
      { symbol: "¥", desc: "yen" },
      { symbol: "¢", desc: "cent sign" },
      { symbol: "§", desc: "section sign" },
      { symbol: "¶", desc: "pilcrow" },
      { symbol: "•", desc: "bullet" },
    ],
  },
];

const buildInitialSectionState = () =>
  SYMBOL_SECTIONS.reduce((acc, section) => {
    acc[section.title] = true;
    return acc;
  }, {});

const loadSectionState = () => {
  if (typeof window === "undefined") return buildInitialSectionState();
  try {
    const stored = window.localStorage.getItem(SECTION_STATE_STORAGE_KEY);
    if (!stored) return buildInitialSectionState();
    const parsed = JSON.parse(stored);
    return SYMBOL_SECTIONS.reduce((acc, section) => {
      acc[section.title] = typeof parsed[section.title] === "boolean" ? parsed[section.title] : true;
      return acc;
    }, {});
  } catch {
    return buildInitialSectionState();
  }
};

const ALL_SYMBOL_ENTRIES = SYMBOL_SECTIONS.flatMap(({ title, symbols }) =>
  symbols.map((symbolData) => ({ ...symbolData, section: title }))
);

const SYMBOL_LOOKUP = ALL_SYMBOL_ENTRIES.reduce((acc, entry) => {
  acc[entry.symbol] = entry;
  return acc;
}, {});

const createEmptyFavoriteSlots = () => Array(FAVORITE_SLOTS).fill(null);

const normalizeFavoriteSlots = (slots) => {
  const normalized = Array.isArray(slots) ? slots.slice(0, FAVORITE_SLOTS) : [];
  while (normalized.length < FAVORITE_SLOTS) {
    normalized.push(null);
  }
  return normalized;
};

const loadFavoriteSlots = () => {
  if (typeof window === "undefined") return createEmptyFavoriteSlots();
  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) return createEmptyFavoriteSlots();
    return normalizeFavoriteSlots(JSON.parse(stored));
  } catch {
    return createEmptyFavoriteSlots();
  }
};

export default function App() {
  const [text, setText] = useState("");
  const [showCheat, setShowCheat] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef(null);
  const insertSymbolRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [openSections, setOpenSections] = useState(loadSectionState);
  const [favoriteSlots, setFavoriteSlots] = useState(createEmptyFavoriteSlots);

  useEffect(() => {
    setFavoriteSlots(loadFavoriteSlots());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favoriteSlots)
      );
    }
  }, [favoriteSlots]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        SECTION_STATE_STORAGE_KEY,
        JSON.stringify(openSections)
      );
    }
  }, [openSections]);

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

  useEffect(() => {
    insertSymbolRef.current = insertSymbol;
  }, [insertSymbol]);

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

  const chunkIntoRows = (symbols) => {
    const rows = [];
    for (let i = 0; i < symbols.length; i += SYMBOL_COLUMNS) {
      const row = symbols.slice(i, i + SYMBOL_COLUMNS);
      while (row.length < SYMBOL_COLUMNS) {
        row.push(null);
      }
      rows.push(row);
    }
    return rows;
  };

  const handleSymbolDragStart = (event, symbol) => {
    event.dataTransfer.setData("text/plain", symbol);
    event.dataTransfer.effectAllowed = "copyMove";
  };

  const handleFavoriteDragStart = (event, symbol, slotIndex) => {
    handleSymbolDragStart(event, symbol);
    event.dataTransfer.setData("application/x-favorite-slot", String(slotIndex));
  };

  const handleFavoriteDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copyMove";
  };

  const handleFavoriteDrop = (event, targetIndex) => {
    event.preventDefault();
    const symbol = event.dataTransfer.getData("text/plain");
    if (!symbol || !SYMBOL_LOOKUP[symbol]) return;

    const sourceIndexData = event.dataTransfer.getData("application/x-favorite-slot");
    const sourceIndex = sourceIndexData ? Number(sourceIndexData) : -1;

    setFavoriteSlots((prev) => {
      if (sourceIndex === targetIndex) return prev;

      const updated = [...prev];
      const targetOriginal = updated[targetIndex];

      if (sourceIndex >= 0 && sourceIndex < FAVORITE_SLOTS) {
        updated[sourceIndex] = null;
      }

      const existingIndex = updated.findIndex((entry) => entry === symbol);
      if (existingIndex !== -1) {
        updated[existingIndex] = null;
      }

      updated[targetIndex] = symbol;

      if (
        sourceIndex >= 0 &&
        sourceIndex < FAVORITE_SLOTS &&
        targetOriginal &&
        targetIndex !== sourceIndex &&
        targetOriginal !== symbol
      ) {
        updated[sourceIndex] = targetOriginal;
      }

      return updated;
    });
  };

  const handleFavoriteClear = (slotIndex) => {
    setFavoriteSlots((prev) => {
      const updated = [...prev];
      updated[slotIndex] = null;
      return updated;
    });
  };

  const SymbolCell = ({ entry }) => {
    if (!entry) {
      return <td className="text-center p-1" />;
    }

    return (
      <td className="text-center p-1">
        <button
          className="btn btn-outline-secondary btn-sm px-2 py-1 w-100"
          onClick={() => insertSymbol(entry.symbol)}
          onDragStart={(event) => handleSymbolDragStart(event, entry.symbol)}
          draggable
          title={entry.desc}
        >
          {entry.symbol}
        </button>
      </td>
    );
  };

  const SymbolRow = ({ entries }) => (
    <tr>
      {entries.map((entry, idx) => (
        <SymbolCell key={idx} entry={entry} />
      ))}
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

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !(prev[title] ?? true),
    }));
  };

  useEffect(() => {
    const handleFavoriteHotkey = (event) => {
      if (!event.altKey || event.ctrlKey || event.metaKey) return;

      const code = event.code || "";
      let numberPressed = null;
      if (code.startsWith("Digit")) {
        numberPressed = Number(code.slice(-1));
      } else if (code.startsWith("Numpad")) {
        numberPressed = Number(code.slice(-1));
      } else if (/^[1-9]$/.test(event.key)) {
        numberPressed = Number(event.key);
      }

      if (numberPressed === null || Number.isNaN(numberPressed) || numberPressed < 1 || numberPressed > FAVORITE_SLOTS) {
        return;
      }

      const slotIndex = numberPressed - 1;
      const symbol = favoriteSlots[slotIndex];
      if (!symbol) return;
      event.preventDefault();
      insertSymbolRef.current?.(symbol);
    };

    window.addEventListener("keydown", handleFavoriteHotkey);
    return () => window.removeEventListener("keydown", handleFavoriteHotkey);
  }, [favoriteSlots]);

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

        {/* Symbol browser + favorites */}
        <div style={{ width: '280px' }} className="mt-2 mt-lg-0">
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="text-uppercase small fw-semibold text-muted">Favorites</span>
              <small className="text-muted">{favoriteSlots.filter(Boolean).length}/{FAVORITE_SLOTS}</small>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {favoriteSlots.map((symbol, slotIndex) => {
                const entry = symbol ? SYMBOL_LOOKUP[symbol] : null;
                const slotLabel = slotIndex + 1;
                return (
                  <div
                    key={slotIndex}
                    className={`border rounded p-2 text-center flex-grow-1 ${entry ? 'bg-white' : 'bg-light'}`}
                    style={{ flex: '1 0 28%', minWidth: '70px' }}
                    onDragOver={handleFavoriteDragOver}
                    onDrop={(event) => handleFavoriteDrop(event, slotIndex)}
                  >
                    {entry ? (
                      <>
                        <button
                          className="btn btn-outline-secondary btn-sm w-100"
                          onClick={() => insertSymbol(entry.symbol)}
                          draggable
                          onDragStart={(event) => handleFavoriteDragStart(event, entry.symbol, slotIndex)}
                          title={`${entry.section}: ${entry.desc}`}
                        >
                          {entry.symbol}
                        </button>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <button
                            type="button"
                            className="btn btn-link btn-sm p-0 text-muted"
                            onClick={() => handleFavoriteClear(slotIndex)}
                            title="Remove from favorites"
                          >
                            ×
                          </button>
                          <small className="text-muted">Alt+{slotLabel}</small>
                        </div>
                      </>
                    ) : (
                      <div className="d-flex flex-column gap-1">
                        <small className="text-muted d-block">Drop symbol</small>
                        <small className="text-muted text-center">Alt+{slotLabel}</small>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <small className="text-muted d-block mt-1">
              Drag symbols here to pin up to 9 quick-access favorites. Use Alt+1–9 anywhere to insert the matching slot.
            </small>
          </div>

          <table className="table table-sm mb-0 small">
            <tbody style={{ 
              lineHeight: 1,
              verticalAlign: 'middle'
            }}>
              {SYMBOL_SECTIONS.map((section) => (
                <React.Fragment key={section.title}>
                  <tr>
                    <th
                      colSpan={SYMBOL_COLUMNS}
                      className="table-light p-0"
                    >
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none text-reset w-100 text-uppercase small fw-semibold d-flex justify-content-between align-items-center px-2 py-1"
                        onClick={() => toggleSection(section.title)}
                        aria-expanded={openSections[section.title] ?? true}
                      >
                        <span>{section.title}</span>
                        <span className="ms-2">
                          {(openSections[section.title] ?? true) ? "▼" : "▶"}
                        </span>
                      </button>
                    </th>
                  </tr>
                  {(openSections[section.title] ?? true) &&
                    chunkIntoRows(section.symbols).map((row, rowIdx) => (
                      <SymbolRow key={`${section.title}-${rowIdx}`} entries={row} />
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
