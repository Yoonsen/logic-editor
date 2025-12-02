import React, { useState, useRef, useEffect } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const SYMBOL_COLUMNS = 5;
const FAVORITES_STORAGE_KEY = "logicEditorFavorites";

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

const ALL_SYMBOL_ENTRIES = SYMBOL_SECTIONS.flatMap(({ title, symbols }) =>
  symbols.map((symbolData) => ({ ...symbolData, section: title }))
);

const SYMBOL_LOOKUP = ALL_SYMBOL_ENTRIES.reduce((acc, entry) => {
  acc[entry.symbol] = entry;
  return acc;
}, {});

const loadFavorites = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function App() {
  const [text, setText] = useState("");
  const [showCheat, setShowCheat] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [openSections, setOpenSections] = useState(buildInitialSectionState);
  const [favoriteSymbols, setFavoriteSymbols] = useState([]);

  useEffect(() => {
    setFavoriteSymbols(loadFavorites());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favoriteSymbols)
      );
    }
  }, [favoriteSymbols]);

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

  const SymbolCell = ({ entry, isFavoritesSection }) => {
    if (!entry) {
      return <td className="text-center p-1" />;
    }

    const isFavorite = favoriteSymbols.includes(entry.symbol);
    const canMoveUp =
      isFavoritesSection &&
      typeof entry.favoriteIndex === "number" &&
      entry.favoriteIndex > 0;
    const canMoveDown =
      isFavoritesSection &&
      typeof entry.favoriteIndex === "number" &&
      entry.favoriteIndex < favoriteSymbols.length - 1;

    return (
      <td className="text-center p-1">
        <div className="d-flex flex-column align-items-center gap-1">
          <button
            className="btn btn-outline-secondary btn-sm px-2 py-1"
            onClick={() => insertSymbol(entry.symbol)}
            title={entry.desc}
          >
            {entry.symbol}
          </button>
          <div className="d-flex align-items-center gap-1">
            <button
              type="button"
              className={`btn btn-link btn-sm p-0 ${isFavorite ? 'text-warning' : 'text-muted'}`}
              onClick={() => toggleFavorite(entry.symbol)}
              aria-pressed={isFavorite}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? "★" : "☆"}
            </button>
            {isFavoritesSection && (
              <div className="btn-group btn-group-sm" role="group" aria-label="reorder favorite">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-1 py-0"
                  onClick={() => moveFavorite(entry.symbol, -1)}
                  disabled={!canMoveUp}
                  title="Move earlier"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-1 py-0"
                  onClick={() => moveFavorite(entry.symbol, 1)}
                  disabled={!canMoveDown}
                  title="Move later"
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    );
  };

  const SymbolRow = ({ entries, isFavoritesSection = false }) => (
    <tr>
      {entries.map((entry, idx) => (
        <SymbolCell
          key={idx}
          entry={entry}
          isFavoritesSection={isFavoritesSection}
        />
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

  const toggleFavorite = (symbol) => {
    setFavoriteSymbols((prev) => {
      if (prev.includes(symbol)) {
        return prev.filter((entry) => entry !== symbol);
      }
      return [...prev, symbol];
    });
  };

  const moveFavorite = (symbol, direction) => {
    setFavoriteSymbols((prev) => {
      const index = prev.indexOf(symbol);
      if (index === -1) return prev;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  };

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !(prev[title] ?? true),
    }));
  };

  const favoriteEntries = favoriteSymbols
    .map((symbol, favoriteIndex) => {
      const entry = SYMBOL_LOOKUP[symbol];
      return entry ? { ...entry, favoriteIndex } : null;
    })
    .filter(Boolean);

  const sectionsToRender = favoriteEntries.length
    ? [{ title: "Favorites", symbols: favoriteEntries }]
    : [];

  const combinedSections = [...sectionsToRender, ...SYMBOL_SECTIONS];

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

        {/* Symbols grouped by category */}
        <div style={{ width: '280px' }} className="mt-2 mt-lg-0">
          <table className="table table-sm mb-0 small">
            <tbody style={{ 
              lineHeight: 1,
              verticalAlign: 'middle'
            }}>
              {combinedSections.map((section) => (
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
                      <SymbolRow
                        key={`${section.title}-${rowIdx}`}
                        entries={row}
                        isFavoritesSection={section.title === "Favorites"}
                      />
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
