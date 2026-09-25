# Behavior Bible

## Reference observations

- Sticky white navigation remains visible while scrolling.
- Top content has centered title/subtitle, then two selectable mode cards.
- Main tool is a two-column editor: controls left, wheel stage right.
- Source wheel rotates after clicking the start action; pointer stays fixed at the right edge.
- Source editor exposes sort, shuffle, clear, advanced mode, textarea, save and start actions.
- Lower page is static explanatory copy followed by a multi-column footer.

## Implemented behavior

- Wheel and `Girar` button start a randomized spin with a 4.7s easing curve.
- Winner is announced in an `aria-live` result card; spin button is disabled while spinning.
- `Itens` tab opens a fixed drawer with backdrop and focus moved to the add field.
- Add form appends a new item; duplicate names are rejected with feedback.
- Each item has an accessible remove button; count updates immediately.
- Mix and clear operate on current items; empty state asks user to add an item.
- Changes persist automatically in `localStorage`.
- `Esc` and backdrop close the drawer; `Espaço` starts the wheel when focus is outside inputs.
- Fullscreen and sound controls provide quick visual feedback.
- `prefers-reduced-motion` disables non-essential transition timing in CSS.
