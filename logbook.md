# Logic Editor Logbook

## 2024-03-19
### Major UI Enhancement: Extended Symbol Table
- Added fifth column to the symbol table
- Increased table width to 280px to accommodate new column
- Added comprehensive set of mathematical symbols:
  - Set theoretic symbols (∈, ∉, ⊂, ⊃, ∅, etc.)
  - Number sets (ℕ, ℤ, ℚ, ℝ, ℂ)
  - Cardinality symbols (ℵ, ℵ₀, ℵ₁, ℵ₂, ℵ₃)
  - Subscripts (₀, ₁, ₂, ₃, ₄, ₅)
  - Superscripts (⁰, ¹, ², ³, etc. and ⁿ, ᵐ, ᵏ, ᵗ, ᵈ)

### Technical Notes
- All symbols implemented as Unicode characters for universal compatibility
- Maintained responsive design and mobile compatibility
- No changes to core functionality required
- Layout adjustments made to accommodate new column while preserving usability

### Performance Considerations
- Identified potential performance optimizations for LaTeX rendering
- Noted possible improvements for mobile performance
- Considered virtualization for symbol table in future updates

### Next Steps
- Test on mobile devices
- Monitor performance with extended symbol set
- Consider implementing performance optimizations
- Gather user feedback on new symbol availability

## 2025-12-02
### Structured Symbol Library + Linear Logic Additions
- Rebuilt the symbol panel as data-driven sections grouped by topic for faster discovery
- Added a dedicated linear-logic set (⊗, ⊸, ⅋, ⊥, !, ?, □, △) to better support sequent-style workflows
- Simplified maintenance by chunking symbol configs into reusable rows instead of hard-coded table markup
- Verified responsive layout still behaves on narrow viewports
- Extended Delimiters with en/em dashes and introduced a Currency & Special block (€, £, ¥, etc.) for harder-to-type characters
- Added collapsible section headers so users can temporarily hide symbol groups they are not using
- Introduced a Favorites section with star toggles, local persistence, and per-symbol reordering controls
- Upgraded favorites UX to a 10-slot drag-and-drop shelf so symbols can be pinned or rearranged by dropping buttons into slots
- Wired Alt+0–9 keyboard shortcuts to the favorite slots for instant insertion while typing
- Persisted collapsed/expanded section state in localStorage so the symbol table remembers your preferred view between sessions
- Labeled each favorite slot with its Alt shortcut right beside the clear button for easy reference

### Build & Deployment
- Installed dependencies and produced a production bundle via `npm run build`
- Published the latest static bundle with `npm run deploy` so updates are live
- Noted sandbox port restrictions for `npm run dev`; local runs remain the preferred way to preview