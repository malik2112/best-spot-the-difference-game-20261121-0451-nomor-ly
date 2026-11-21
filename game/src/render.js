// Taman Kota — the renderer: HUD, the two park pictures, found rings,
// the hint ring, the keyboard reticle, and the title/clear/win overlays.
// It only reads state; main.js owns every rule.

import { FIELD, FONT, HUD, LEVELS, PALETTE, PANEL, RULES } from './config.js';
import { drawScene, SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_WIN = 'win';
export const SCREEN_OVER = 'over';

/** The hint button in logical coordinates (input.js asks main.js). */
export const HINT_BUTTON = { x: 1056, y: 28, w: 200, h: 52 };

function text(ctx, value, x, y, size, color, align, weight) {
  ctx.fillStyle = color;
  ctx.font = `${weight || 600} ${size}px ${FONT}`;
  ctx.textAlign = align || 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawHud(ctx, state) {
  ctx.fillStyle = PALETTE.hudBg;
  ctx.fillRect(0, 0, FIELD.width, HUD.height);
  ctx.fillStyle = PALETTE.hudLine;
  ctx.fillRect(0, HUD.height - 2, FIELD.width, 2);
  text(ctx, 'Taman Kota', 24, 34, 30, PALETTE.text, 'left', 800);
  text(ctx, LEVELS[state.level].name, 24, 66, 17, PALETTE.muted, 'left', 600);
  const left = state.total - state.foundCount;
  text(ctx, `${left} left`, 640, 38, 34, PALETTE.text, 'center', 800);
  text(ctx, `${state.foundCount} of ${state.total} found`, 640, 70, 16, PALETTE.muted, 'center', 600);
  text(ctx, `Score ${state.score}`, 1010, 34, 20, PALETTE.text, 'right', 700);
  if (state.streak >= 2) {
    text(ctx, `Streak x${state.streak}`, 1010, 62, 16, PALETTE.hint, 'right', 700);
  }
  // Hint button: bright when ready, dim with a countdown while cooling.
  const ready = state.hintCooldown <= 0 && state.screen === SCREEN_PLAY;
  ctx.fillStyle = ready ? PALETTE.button : '#1a2e24';
  roundRect(ctx, HINT_BUTTON.x, HINT_BUTTON.y, HINT_BUTTON.w, HINT_BUTTON.h, 10);
  ctx.fill();
  ctx.strokeStyle = ready ? PALETTE.buttonEdge : PALETTE.hudLine;
  ctx.lineWidth = 2;
  ctx.stroke();
  const label = ready ? 'Hint (H) · -50' : `Hint in ${Math.ceil(state.hintCooldown)}s`;
  text(ctx, label, HINT_BUTTON.x + HINT_BUTTON.w / 2, HINT_BUTTON.y + 27, 17, ready ? PALETTE.text : PALETTE.muted, 'center', 700);
  // Timer bar across the HUD bottom.
  const total = LEVELS[state.level].seconds;
  const frac = Math.max(0, Math.min(1, state.timeLeft / total));
  ctx.fillStyle = '#0c1a13';
  ctx.fillRect(24, 104, FIELD.width - 48, 14);
  ctx.fillStyle = state.timeLeft <= 20 ? PALETTE.timerLow : PALETTE.timerOk;
  ctx.fillRect(24, 104, (FIELD.width - 48) * frac, 14);
  text(ctx, `${Math.ceil(state.timeLeft)}s`, 640, 111, 13, '#0c1a13', 'center', 800);
}

function drawPanel(ctx, state, panel) {
  const x0 = panel === 0 ? PANEL.leftX : PANEL.rightX;
  const y0 = PANEL.y;
  ctx.save();
  ctx.translate(x0, y0);
  drawScene(ctx, state.level, panel);
  const scene = SCENES[state.level];
  for (const diff of scene.diffs) {
    if (!state.found.has(diff.id)) continue;
    ctx.strokeStyle = PALETTE.found;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = PALETTE.foundGlow;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r + 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (state.hint && state.screen === SCREEN_PLAY) {
    const d = state.hint.diff;
    ctx.strokeStyle = PALETTE.hint;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 10 + Math.sin(state.animTime * 6) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (state.miss && state.miss.panel === panel) {
    ctx.strokeStyle = PALETTE.miss;
    ctx.lineWidth = 5;
    const m = state.miss;
    ctx.beginPath();
    ctx.moveTo(m.x - 14, m.y - 14);
    ctx.lineTo(m.x + 14, m.y + 14);
    ctx.moveTo(m.x + 14, m.y - 14);
    ctx.lineTo(m.x - 14, m.y + 14);
    ctx.stroke();
  }
  if (state.screen === SCREEN_PLAY && state.activePanel === panel && !state.paused) {
    const r = state.reticle;
    ctx.strokeStyle = PALETTE.hint;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r.x - 28, r.y);
    ctx.lineTo(r.x - 10, r.y);
    ctx.moveTo(r.x + 10, r.y);
    ctx.lineTo(r.x + 28, r.y);
    ctx.moveTo(r.x, r.y - 28);
    ctx.lineTo(r.x, r.y - 10);
    ctx.moveTo(r.x, r.y + 10);
    ctx.lineTo(r.x, r.y + 28);
    ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle = state.activePanel === panel && state.screen === SCREEN_PLAY ? PALETTE.panelEdgeActive : PALETTE.panelEdge;
  ctx.lineWidth = 4;
  ctx.strokeRect(x0, y0, PANEL.width, PANEL.height);
}

function overlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(8,20,14,0.72)';
  ctx.fillRect(0, HUD.height, FIELD.width, FIELD.height - HUD.height);
  text(ctx, title, 640, 320, 52, accent || PALETTE.text, 'center', 800);
  lines.forEach((line, i) => {
    text(ctx, line, 640, 380 + i * 30, 20, PALETTE.muted, 'center', 600);
  });
}

/** Paint the whole frame for `state` onto the 2D context. */
export function drawFrame(ctx, state) {
  ctx.fillStyle = PALETTE.backdrop;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  ctx.save();
  if (state.shake > 0) {
    const s = state.shake * 8;
    ctx.translate(Math.sin(state.animTime * 70) * s, Math.cos(state.animTime * 63) * s * 0.6);
  }
  drawHud(ctx, state);
  drawPanel(ctx, state, 0);
  drawPanel(ctx, state, 1);
  text(ctx, 'Click a difference on either picture · Arrows + Enter to mark · Tab switches picture · H hint · P pause · R restart · Wrong click -3s', 640, HUD.footerY + 30, 16, PALETTE.muted, 'center', 600);
  if (state.best > 0) {
    text(ctx, `Best ${state.best}`, 1256, HUD.footerY + 30, 15, PALETTE.muted, 'right', 600);
  }
  ctx.restore();
  if (state.screen === SCREEN_TITLE) {
    overlay(ctx, 'Taman Kota', [
      'Two park pictures. Seven, eight, then ten differences hide between them.',
      'Click a difference — or steer the reticle with the arrow keys and press Enter.',
      'Wrong clicks cost 3 seconds. A hint costs 50 points.',
      'Click or press Enter to start',
    ], PALETTE.hint);
  } else if (state.screen === SCREEN_CLEAR) {
    overlay(ctx, 'Level clear!', [
      `Score ${state.score} · time bonus added`,
      'Click or press Enter for the next level',
    ], PALETTE.found);
  } else if (state.screen === SCREEN_WIN) {
    overlay(ctx, 'Park ranger!', [
      `Every difference found. Final score ${state.score}.`,
      `Best ${state.best}`,
      'Click or press Enter to play again',
    ], PALETTE.found);
  } else if (state.screen === SCREEN_OVER) {
    overlay(ctx, 'Out of time', [
      `${state.total - state.foundCount} differences stayed hidden. Score ${state.score}.`,
      'Click or press Enter to try again',
    ], PALETTE.miss);
  } else if (state.paused) {
    overlay(ctx, 'Paused', ['Press P to keep hunting'], PALETTE.text);
  }
}
