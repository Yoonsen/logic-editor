# Logic Formula Editor

A tiny, zero-install playground for writing logical formulas, LaTeX snippets, and Unicode-heavy math expressions.  
It exposes a curated palette of connective symbols, set-theory operators, number sets, and a full Greek alphabet so you can quickly copy/paste the exact glyphs you need into mail, Docs, Slack, etc.

## Key Features

- **Data‑driven symbol sections** – set operations, number sets, cardinalities, superscripts/subscripts, delimiters, currency, and now the complete Greek alphabet.
- **Collapsible categories** – collapse rarely used sections; their state is persisted automatically in `localStorage`.
- **Favorites shelf** – drag any symbol into one of nine quick slots. Slots show a subtle badge with their hotkey.
- **Keyboard shortcuts** – press `Alt+1` through `Alt+9` anywhere in the app to insert the corresponding favorite into the editor.
- **Drag-to-replace** – dropping a new symbol on a filled slot replaces it; no extra UI needed to clear entries.
- **Clipboard friendly** – text area always contains the plain Unicode symbols, so copy/paste “just works” in email clients and word processors.

## Usage

1. Install dependencies once:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` and start composing formulas. Click symbols or press the assigned hotkeys to insert them at the caret.

### Favorites / Hotkeys

- Drag symbols into the favorites grid (3×3). Each slot displays its numeric badge.
- `Alt+1` … `Alt+9` insert the symbol in slot 1 … 9 respectively.
- Dragging a new symbol onto an occupied slot overwrites it; to “clear” a slot, drop an empty space or another placeholder.

## Deployment

The project ships as a static site (Vite). To build and publish to GitHub Pages:

```bash
npm run deploy   # runs build + gh-pages -d dist
```

## Tech Stack

- Vite + React 18
- `react-katex` for inline/block math rendering preview
- Bootstrap utility classes for quick layouting

## Clipboard/Data Considerations

- The main textarea always mirrors the literal characters you insert. Copying from the preview or pressing the clipboard button yields clean Unicode (no LaTeX control sequences unless you typed them yourself).
- Persisted data (favorites, collapsed sections) lives entirely in `localStorage` on the client; nothing is sent to a backend.