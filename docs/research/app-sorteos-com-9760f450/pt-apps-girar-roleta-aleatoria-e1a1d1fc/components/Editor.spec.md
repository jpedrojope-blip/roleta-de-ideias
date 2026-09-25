# Editor Specification

## Overview
- **Target file:** `index.html`, `styles.css`, `app.js`
- **Screenshot:** `docs/design-references/app-sorteos-com-9760f450/pt-apps-girar-roleta-aleatoria-e1a1d1fc/README.md`
- **Interaction model:** click-driven + text input + time-driven spin

## DOM Structure

`wheel-card` contains a floating `items-tab`, status pill, SVG rotor, fixed pointer, hint, result card and quick actions. `items-panel` is a fixed right-side drawer with add form, list of item rows and footer action.

## Computed/reference style notes

- Items tab: left-side floating tab with item count.
- Drawer: white 390px maximum-width surface, fixed to the right, blurred backdrop.
- Add input: 45px high with magenta add button.
- Item row: 44px minimum height, visible number, text and individual remove control.
- Wheel stage: pale blue-lavender background, 710px minimum height, centered wheel.
- Pointer: fixed on the right center edge; rotor rotates underneath it.
- Primary action: green; save action: magenta; both minimum 53px high.

## States & behaviors

- Adding/removing redraws wheel and updates count.
- Shuffle and clear redraw list and wheel.
- Empty list displays recovery guidance.
- Spin disables action for 4.7s, then announces winner and recommended offer.
- Mobile breakpoint stacks editor above wheel stage.
