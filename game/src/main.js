// Taman Kota — the game loop and rules: marking differences, the
// countdown, score and streaks, hints on cooldown, and the screens.
// Rendering lives in render.js, scenes in scenes.js, input in input.js.

import { BEST_KEY, FIELD, LEVELS, PANEL, RULES, STEP } from './config.js';
import { playClear, playFound, playHint, playMiss, playTick, toggleMute } from './audio.js';
import { attachInput } from './input.js';
import { drawFrame, HINT_BUTTON, SCREEN_CLEAR, SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';
import { SCENES } from './scenes.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const ctx = canvas.getContext('2d');

const state = {
  screen: SCREEN_TITLE,
  paused: false,
  level: 0,
  total: LEVELS[0].diffs,
  found: new Set(),
  foundCount: 0,
  score: 0,
  streak: 0,
  best: loadBest(),
  timeLeft: LEVELS[0].seconds,
  hintCooldown: 0,
  hint: null,
  miss: null,
  shake: 0,
  animTime: 0,
  activePanel: 0,
  reticle: { x: 300, y: 226 },
  lastTickSecond: -1,
};

function loadBest() {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off: the best score then lasts this visit only.
  }
}

function announce(message) {
  status.textContent = message;
}

function startLevel(index, keepScore) {
  state.level = index;
  state.total = LEVELS[index].diffs;
  state.found = new Set();
  state.foundCount = 0;
  state.streak = 0;
  state.timeLeft = LEVELS[index].seconds;
  state.hintCooldown = 0;
  state.hint = null;
  state.miss = null;
  state.shake = 0;
  state.paused = false;
  state.activePanel = 0;
  state.reticle = { x: 300, y: 226 };
  state.lastTickSecond = -1;
  if (!keepScore) state.score = 0;
  state.screen = SCREEN_PLAY;
  announce(`${LEVELS[index].name}. ${state.total} differences to find.`);
}

function finishRun() {
  if (state.score > state.best) {
    state.best = state.score;
    saveBest(state.best);
  }
}

function markAt(panel, lx, ly) {
  if (state.screen !== SCREEN_PLAY || state.paused) return;
  const scene = SCENES[state.level];
  for (const diff of scene.diffs) {
    if (state.found.has(diff.id)) continue;
    const dx = lx - diff.x;
    const dy = ly - diff.y;
    const reach = diff.r + RULES.hitSlack;
    if (dx * dx + dy * dy <= reach * reach) {
      state.found.add(diff.id);
      state.foundCount += 1;
      state.streak += 1;
      state.score += RULES.findPoints + (state.streak - 1) * RULES.streakBonus;
      if (state.hint && state.hint.diff.id === diff.id) state.hint = null;
      playFound(state.streak);
      const left = state.total - state.foundCount;
      announce(left === 0 ? 'All found!' : `Found ${diff.label}. ${left} left.`);
      if (left === 0) {
        state.score += Math.ceil(state.timeLeft) * RULES.timeBonusPerSecond;
        playClear();
        if (state.level >= LEVELS.length - 1) {
          state.screen = SCREEN_WIN;
          finishRun();
          announce(`Park ranger! Final score ${state.score}.`);
        } else {
          state.screen = SCREEN_CLEAR;
        }
      }
      return;
    }
  }
  state.streak = 0;
  state.timeLeft = Math.max(0, state.timeLeft - RULES.wrongPenaltySeconds);
  state.miss = { panel, x: lx, y: ly, ttl: 0.6 };
  state.shake = 0.35;
  playMiss();
  announce(`Not there. Minus ${RULES.wrongPenaltySeconds} seconds.`);
}

function useHint() {
  if (state.screen !== SCREEN_PLAY || state.paused) return;
  if (state.hintCooldown > 0) return;
  const remaining = SCENES[state.level].diffs.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  state.hint = { diff, ttl: 2.4 };
  state.hintCooldown = RULES.hintCooldownSeconds;
  state.score = Math.max(0, state.score - RULES.hintCost);
  playHint();
  announce(`Hint: look for ${diff.label}.`);
}

function confirm() {
  if (state.screen === SCREEN_TITLE) startLevel(0, false);
  else if (state.screen === SCREEN_CLEAR) startLevel(state.level + 1, true);
  else if (state.screen === SCREEN_WIN || state.screen === SCREEN_OVER) startLevel(0, false);
}

function update(dt) {
  state.animTime += dt;
  if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);
  if (state.miss) {
    state.miss.ttl -= dt;
    if (state.miss.ttl <= 0) state.miss = null;
  }
  if (state.screen !== SCREEN_PLAY || state.paused) return;
  if (state.hintCooldown > 0) state.hintCooldown = Math.max(0, state.hintCooldown - dt);
  if (state.hint) {
    state.hint.ttl -= dt;
    if (state.hint.ttl <= 0) state.hint = null;
  }
  state.timeLeft -= dt;
  const whole = Math.ceil(state.timeLeft);
  if (whole <= 10 && whole >= 1 && whole !== state.lastTickSecond) {
    state.lastTickSecond = whole;
    playTick();
  }
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = SCREEN_OVER;
    finishRun();
    announce(`Out of time. Score ${state.score}.`);
  }
}

function resize() {
  const scale = Math.min(window.innerWidth / FIELD.width, window.innerHeight / FIELD.height);
  canvas.width = Math.round(FIELD.width * scale);
  canvas.height = Math.round(FIELD.height * scale);
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
}

attachInput(canvas, {
  onHud(x, y) {
    if (x >= HINT_BUTTON.x && x <= HINT_BUTTON.x + HINT_BUTTON.w && y >= HINT_BUTTON.y && y <= HINT_BUTTON.y + HINT_BUTTON.h) {
      useHint();
      return true;
    }
    return false;
  },
  onMark: markAt,
  onConfirm: confirm,
  onHint: useHint,
  onPause() {
    if (state.screen === SCREEN_PLAY) state.paused = !state.paused;
  },
  onRestart() {
    if (state.screen === SCREEN_PLAY) startLevel(state.level, state.level > 0);
  },
  onMute() {
    announce(toggleMute() ? 'Sound off.' : 'Sound on.');
  },
  onReticle(dx, dy) {
    state.reticle.x = Math.max(0, Math.min(PANEL.width, state.reticle.x + dx * RULES.reticleSpeed * STEP * 4));
    state.reticle.y = Math.max(0, Math.min(PANEL.height, state.reticle.y + dy * RULES.reticleSpeed * STEP * 4));
  },
  onSwitchPanel() {
    state.activePanel = state.activePanel === 0 ? 1 : 0;
  },
  onMarkReticle() {
    if (state.screen === SCREEN_PLAY && !state.paused) markAt(state.activePanel, state.reticle.x, state.reticle.y);
    else confirm();
  },
});

const shotName = new URLSearchParams(window.location.search).get('shot');
if (shotName) stageShot(shotName, state);

window.addEventListener('resize', resize);
resize();

let last = performance.now();
let acc = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (!shotName) {
    acc += dt;
    while (acc >= STEP) {
      update(STEP);
      acc -= STEP;
    }
  }
  const scaleX = canvas.width / FIELD.width;
  const scaleY = canvas.height / FIELD.height;
  ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
  drawFrame(ctx, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
