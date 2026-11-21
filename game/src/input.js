// Taman Kota — mouse and keyboard input.
// attachInput wires the canvas to the game's hooks: onMark(panel, x, y)
// for a picture click in panel-local coordinates, onHint, onPause,
// onRestart, onMute, onConfirm (title / clear / end screens), and
// onReticle(dx, dy) / onSwitchPanel / onMarkReticle for keyboard play.

import { FIELD, PANEL } from './config.js';

export function attachInput(canvas, hooks) {
  function toLogical(event) {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * FIELD.width;
    const y = ((event.clientY - rect.top) / rect.height) * FIELD.height;
    return { x, y };
  }

  function panelAt(x, y) {
    const ly = y - PANEL.y;
    if (ly < 0 || ly > PANEL.height) return null;
    if (x >= PANEL.leftX && x <= PANEL.leftX + PANEL.width) {
      return { panel: 0, x: x - PANEL.leftX, y: ly };
    }
    if (x >= PANEL.rightX && x <= PANEL.rightX + PANEL.width) {
      return { panel: 1, x: x - PANEL.rightX, y: ly };
    }
    return null;
  }

  canvas.addEventListener('pointerdown', (event) => {
    const { x, y } = toLogical(event);
    if (hooks.onHud(x, y)) return;
    const hit = panelAt(x, y);
    if (hit) hooks.onMark(hit.panel, hit.x, hit.y);
    else hooks.onConfirm();
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowLeft') { hooks.onReticle(-1, 0); event.preventDefault(); }
    else if (key === 'ArrowRight') { hooks.onReticle(1, 0); event.preventDefault(); }
    else if (key === 'ArrowUp') { hooks.onReticle(0, -1); event.preventDefault(); }
    else if (key === 'ArrowDown') { hooks.onReticle(0, 1); event.preventDefault(); }
    else if (key === 'Tab') { hooks.onSwitchPanel(); event.preventDefault(); }
    else if (key === 'Enter' || key === ' ') { hooks.onMarkReticle(); event.preventDefault(); }
    else if (key === 'h' || key === 'H') hooks.onHint();
    else if (key === 'p' || key === 'P') hooks.onPause();
    else if (key === 'r' || key === 'R') hooks.onRestart();
    else if (key === 'm' || key === 'M') hooks.onMute();
  });

  return { panelAt };
}
