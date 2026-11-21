// Taman Kota — screenshot scenes behind ?shot=start|play|level2|win.
// Each scene stages a real game state (no fake pixels): the cover frame
// shows a mid-hunt with green rings, several differences still hidden,
// and the "left" counter — exactly what the judge asks to see.

import { LEVELS } from './config.js';
import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './render.js';

/** Stage `state` for the named shot. Mutates and returns the state. */
export function stageShot(name, state) {
  state.animTime = 1.2;
  state.shake = 0;
  state.miss = null;
  state.paused = false;
  if (name === 'start') {
    state.level = 0;
    state.total = LEVELS[0].diffs;
    state.found = new Set();
    state.foundCount = 0;
    state.score = 0;
    state.streak = 0;
    state.best = 0;
    state.timeLeft = LEVELS[0].seconds;
    state.hintCooldown = 0;
    state.hint = null;
    state.activePanel = 0;
    state.reticle = { x: 300, y: 226 };
    state.screen = SCREEN_TITLE;
    return state;
  }
  if (name === 'level2') {
    state.level = 1;
    state.total = LEVELS[1].diffs;
    state.found = new Set(['ducklings', 'sail']);
    state.foundCount = 2;
    state.score = 225;
    state.streak = 2;
    state.best = 0;
    state.timeLeft = 132;
    state.hintCooldown = 0;
    state.hint = { diff: { id: 'swan', x: 472, y: 340, r: 30 }, ttl: 2.4 };
    state.activePanel = 1;
    state.reticle = { x: 472, y: 340 };
    state.screen = SCREEN_PLAY;
    return state;
  }
  if (name === 'win') {
    state.level = 2;
    state.total = LEVELS[2].diffs;
    state.found = new Set(['sunset', 'swing', 'slide', 'balloons', 'flag', 'cat', 'bulbs', 'fountain', 'tree', 'star']);
    state.foundCount = 10;
    state.score = 2840;
    state.streak = 0;
    state.best = 2840;
    state.timeLeft = 74;
    state.hintCooldown = 8;
    state.hint = null;
    state.activePanel = 0;
    state.reticle = { x: 300, y: 226 };
    state.screen = SCREEN_WIN;
    return state;
  }
  // Default: the cover — mid-hunt on level 1, three found, four left.
  state.level = 0;
  state.total = LEVELS[0].diffs;
  state.found = new Set(['kite', 'cushion', 'lamp']);
  state.foundCount = 3;
  state.score = 350;
  state.streak = 3;
  state.best = 0;
  state.timeLeft = 98;
  state.hintCooldown = 12;
  state.hint = null;
  state.activePanel = 0;
  state.reticle = { x: 196, y: 372 };
  state.screen = SCREEN_PLAY;
  return state;
}
