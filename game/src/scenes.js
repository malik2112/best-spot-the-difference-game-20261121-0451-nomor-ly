// Taman Kota — three hand-drawn park scenes, painted twice each.
// drawScene(ctx, level, variant) paints one panel (600x452, panel-local
// coordinates). Variant 0 is the left picture, variant 1 the right one;
// the differences listed in SCENES[level].diffs are exactly the spots
// where the two variants disagree. Everything is canvas shapes — no
// images, no fonts, nothing loaded.

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 452);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 452);
}

function grass(ctx, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, y, 600, 452 - y);
}

function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 22 * s, y + 4 * s, 14 * s, 0, Math.PI * 2);
  ctx.arc(x - 22 * s, y + 5 * s, 13 * s, 0, Math.PI * 2);
  ctx.fill();
}

function sun(ctx, x, y, r, rays) {
  ctx.fillStyle = '#ffd94d';
  if (rays) {
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a) * (r + 4), y + Math.sin(a) * (r + 4));
      ctx.lineTo(x + Math.cos(a) * (r + 16), y + Math.sin(a) * (r + 16));
      ctx.stroke();
    }
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function bird(ctx, x, y, s) {
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.1, Math.PI * 1.9);
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
}

function tree(ctx, x, y, s, leafy, leaf, trunk) {
  ctx.fillStyle = trunk;
  ctx.fillRect(x - 5 * s, y - 46 * s, 10 * s, 46 * s);
  if (!leafy) {
    ctx.strokeStyle = trunk;
    ctx.lineWidth = 4 * s;
    ctx.beginPath();
    ctx.moveTo(x, y - 40 * s);
    ctx.lineTo(x - 22 * s, y - 66 * s);
    ctx.moveTo(x, y - 44 * s);
    ctx.lineTo(x + 20 * s, y - 72 * s);
    ctx.stroke();
    return;
  }
  ctx.fillStyle = leaf;
  ctx.beginPath();
  ctx.arc(x, y - 74 * s, 30 * s, 0, Math.PI * 2);
  ctx.arc(x - 24 * s, y - 56 * s, 21 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y - 56 * s, 21 * s, 0, Math.PI * 2);
  ctx.fill();
}

function bench(ctx, x, y, cushion) {
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(x, y, 110, 10);
  ctx.fillRect(x, y - 26, 110, 8);
  ctx.fillRect(x, y - 14, 110, 6);
  ctx.fillRect(x + 6, y + 10, 8, 20);
  ctx.fillRect(x + 96, y + 10, 8, 20);
  if (cushion) {
    ctx.fillStyle = '#e63946';
    ctx.fillRect(x + 38, y - 8, 34, 8);
  }
}

function lampPost(ctx, x, y, lit) {
  ctx.fillStyle = '#264653';
  ctx.fillRect(x - 3, y - 84, 6, 84);
  ctx.fillRect(x - 12, y - 92, 24, 10);
  if (lit) {
    ctx.fillStyle = 'rgba(255,214,102,0.45)';
    ctx.beginPath();
    ctx.arc(x, y - 78, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd666';
  } else {
    ctx.fillStyle = '#cfe8ef';
  }
  ctx.beginPath();
  ctx.arc(x, y - 78, 9, 0, Math.PI * 2);
  ctx.fill();
}

function tulip(ctx, x, y, color) {
  ctx.strokeStyle = '#2d6a4f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 14);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 5, y - 14);
  ctx.lineTo(x - 5, y - 24);
  ctx.lineTo(x, y - 19);
  ctx.lineTo(x + 5, y - 24);
  ctx.lineTo(x + 5, y - 14);
  ctx.closePath();
  ctx.fill();
}

function kite(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - 20);
  ctx.lineTo(x + 14, y);
  ctx.lineTo(x, y + 24);
  ctx.lineTo(x - 14, y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(x, y + 24);
  ctx.quadraticCurveTo(x + 10, y + 44, x + 26, y + 62);
  ctx.stroke();
}

function dog(ctx, x, y, collar) {
  ctx.fillStyle = '#c98f4e';
  ctx.beginPath();
  ctx.ellipse(x, y, 26, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 26, y - 10, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x - 20, y + 10, 6, 14);
  ctx.fillRect(x + 12, y + 10, 6, 14);
  ctx.strokeStyle = '#c98f4e';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(x - 26, y - 4);
  ctx.quadraticCurveTo(x - 38, y - 16, x - 34, y - 26);
  ctx.stroke();
  if (collar) {
    ctx.fillStyle = '#e63946';
    ctx.fillRect(x + 16, y - 16, 8, 12);
  }
}

function duck(ctx, x, y, s) {
  ctx.fillStyle = '#f4f1de';
  ctx.beginPath();
  ctx.ellipse(x, y, 20 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 16 * s, y - 10 * s, 8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f4a259';
  ctx.beginPath();
  ctx.moveTo(x + 23 * s, y - 10 * s);
  ctx.lineTo(x + 32 * s, y - 7 * s);
  ctx.lineTo(x + 23 * s, y - 5 * s);
  ctx.fill();
}

function drawPagi(ctx, v) {
  sky(ctx, '#8ecae6', '#e8f6ff');
  grass(ctx, 300, '#74c69d');
  ctx.fillStyle = '#d9c7a7';
  ctx.beginPath();
  ctx.moveTo(0, 452);
  ctx.lineTo(600, 452);
  ctx.lineTo(430, 330);
  ctx.lineTo(170, 330);
  ctx.closePath();
  ctx.fill();
  sun(ctx, 520, 62, 26, v === 0);
  cloud(ctx, 90, 56, 1, '#ffffff');
  cloud(ctx, 330, 42, 0.8, '#ffffff');
  kite(ctx, 150, 84, v === 0 ? '#e63946' : '#4361ee');
  bird(ctx, 270, 52, 1);
  bird(ctx, 308, 66, 0.8);
  if (v === 0) bird(ctx, 346, 50, 0.9);
  tree(ctx, 52, 330, 1.1, true, '#40916c', '#7a4a21');
  tree(ctx, 556, 322, 0.9, true, '#40916c', '#7a4a21');
  bench(ctx, 140, 348, v === 0);
  lampPost(ctx, 470, 352, v === 1);
  const tulips = [[70, 404], [92, 412], [114, 404], [136, 412], [158, 404]];
  tulips.forEach(([x, y], i) => {
    if (v === 1 && i === 2) return;
    tulip(ctx, x, y, i % 2 ? '#f72585' : '#ffb703');
  });
  dog(ctx, 380, 382, v === 0);
  ctx.fillStyle = '#e63946';
  ctx.beginPath();
  ctx.arc(440, 404, 9, 0, Math.PI * 2);
  ctx.fill();
}

function drawDanau(ctx, v) {
  sky(ctx, '#a8dadc', '#eefbfb');
  grass(ctx, 250, '#95d5b2');
  ctx.fillStyle = '#48cae4';
  ctx.beginPath();
  ctx.ellipse(300, 356, 290, 92, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#90e0ef';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(300, 356, 250, 74, 0, 0.2, Math.PI * 0.9);
  ctx.stroke();
  sun(ctx, 70, 56, 22, true);
  cloud(ctx, 430, 48, 1, '#ffffff');
  tree(ctx, 44, 262, 1.2, true, '#2d6a4f', '#6b4226');
  tree(ctx, 560, 256, 1, true, '#2d6a4f', '#6b4226');
  // Bridge across the top of the pond.
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(300, 300, 190, Math.PI * 1.08, Math.PI * 1.92);
  ctx.stroke();
  lampPost(ctx, 498, 262, v === 0);
  // Picnic umbrella on the left bank.
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(118, 250);
  ctx.lineTo(118, 188);
  ctx.stroke();
  if (v === 0) {
    ctx.fillStyle = '#f72585';
    ctx.beginPath();
    ctx.arc(118, 188, 44, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = '#f72585';
    ctx.beginPath();
    ctx.moveTo(118, 152);
    ctx.lineTo(128, 190);
    ctx.lineTo(108, 190);
    ctx.closePath();
    ctx.fill();
  }
  // Sailboat.
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath();
  ctx.moveTo(392, 292);
  ctx.lineTo(456, 292);
  ctx.lineTo(444, 308);
  ctx.lineTo(404, 308);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(424, 292);
  ctx.lineTo(424, 238);
  ctx.stroke();
  ctx.fillStyle = v === 0 ? '#ffffff' : '#ffb703';
  ctx.beginPath();
  ctx.moveTo(424, 240);
  ctx.lineTo(424, 288);
  ctx.lineTo(452, 288);
  ctx.closePath();
  ctx.fill();
  duck(ctx, 180, 330, 1);
  duck(ctx, 150, 352, 0.55);
  duck(ctx, 196, 356, 0.55);
  if (v === 0) duck(ctx, 172, 368, 0.55);
  if (v === 0) {
    ctx.fillStyle = '#f4a259';
    ctx.beginPath();
    ctx.ellipse(302, 322, 14, 6, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(302, 336, 16, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }
  ctx.fillStyle = '#40916c';
  const reeds = v === 0 ? [80, 92, 104] : [80, 92, 104, 116, 128];
  reeds.forEach((x) => ctx.fillRect(x, 300, 4, 44));
  ctx.fillStyle = v === 0 ? '#f72585' : '#ffffff';
  ctx.beginPath();
  ctx.arc(252, 388, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2d6a4f';
  ctx.beginPath();
  ctx.ellipse(252, 396, 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  if (v === 0) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(462, 356, 24, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(480, 350);
    ctx.quadraticCurveTo(494, 330, 486, 316);
    ctx.stroke();
    ctx.fillStyle = '#f4a259';
    ctx.beginPath();
    ctx.arc(486, 314, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSore(ctx, v) {
  sky(ctx, '#3a2e5c', '#f4a259');
  grass(ctx, 310, '#52796f');
  sun(ctx, 300, v === 0 ? 150 : 120, v === 0 ? 34 : 24, false);
  ctx.fillStyle = '#ffffff';
  [[70, 60], [150, 40], [520, 44]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 2.6, 0, Math.PI * 2);
    ctx.fill();
  });
  if (v === 1) {
    ctx.beginPath();
    ctx.arc(478, 66, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  cloud(ctx, 120, 110, 0.9, '#e8b4b8');
  cloud(ctx, 480, 120, 0.8, '#e8b4b8');
  tree(ctx, 56, 336, 1.1, v === 0, '#40916c', '#5b3a1e');
  tree(ctx, 552, 330, 1, true, '#40916c', '#5b3a1e');
  // String lights between two poles.
  ctx.fillStyle = '#264653';
  ctx.fillRect(150, 150, 5, 160);
  ctx.fillRect(446, 150, 5, 160);
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(152, 152);
  ctx.quadraticCurveTo(300, 196, 448, 152);
  ctx.stroke();
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const x = 152 + t * 296;
    const y = 152 + Math.sin(t * Math.PI) * 30;
    ctx.fillStyle = v === 1 && i === 3 ? '#4361ee' : '#ffd166';
    ctx.beginPath();
    ctx.arc(x, y + 8, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  // Fountain.
  ctx.fillStyle = '#90e0ef';
  ctx.beginPath();
  ctx.ellipse(382, 226, 44, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#6c757d';
  ctx.fillRect(376, 190, 12, 34);
  if (v === 0) {
    ctx.strokeStyle = '#caf0f8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(382, 190);
    ctx.quadraticCurveTo(362, 162, 348, 196);
    ctx.moveTo(382, 190);
    ctx.quadraticCurveTo(402, 162, 416, 196);
    ctx.moveTo(382, 190);
    ctx.lineTo(382, 158);
    ctx.stroke();
  }
  // Swing frame.
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(108, 360);
  ctx.lineTo(140, 262);
  ctx.lineTo(196, 262);
  ctx.lineTo(228, 360);
  ctx.moveTo(140, 262);
  ctx.lineTo(196, 262);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(158, 262);
  ctx.lineTo(158, 316);
  ctx.moveTo(180, 262);
  ctx.lineTo(180, 316);
  ctx.stroke();
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(150, 316, 38, 7);
  if (v === 1) {
    ctx.fillStyle = '#1d3557';
    ctx.beginPath();
    ctx.arc(169, 288, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(161, 296, 16, 22);
  }
  // Slide.
  ctx.fillStyle = '#264653';
  ctx.fillRect(404, 300, 6, 62);
  ctx.fillRect(436, 300, 6, 62);
  ctx.fillStyle = v === 0 ? '#e63946' : '#4361ee';
  ctx.beginPath();
  ctx.moveTo(410, 300);
  ctx.lineTo(472, 356);
  ctx.lineTo(472, 368);
  ctx.lineTo(410, 312);
  ctx.closePath();
  ctx.fill();
  // Balloons.
  const balloons = v === 0 ? [[520, 140], [544, 122], [498, 120]] : [[520, 140], [544, 122]];
  balloons.forEach(([x, y], i) => {
    ctx.fillStyle = ['#f72585', '#ffb703', '#4361ee'][i];
    ctx.beginPath();
    ctx.ellipse(x, y, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  // Ice-cream cart with a flag.
  ctx.fillStyle = '#f1faee';
  ctx.fillRect(48, 250, 66, 44);
  ctx.fillStyle = '#e63946';
  ctx.fillRect(48, 250, 66, 10);
  ctx.fillStyle = '#264653';
  ctx.beginPath();
  ctx.arc(62, 300, 8, 0, Math.PI * 2);
  ctx.arc(100, 300, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(81, 250);
  ctx.lineTo(81, 222);
  ctx.stroke();
  if (v === 0) {
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.moveTo(81, 222);
    ctx.lineTo(103, 229);
    ctx.lineTo(81, 236);
    ctx.closePath();
    ctx.fill();
  }
  // Bench with a cat.
  bench(ctx, 252, 366, false);
  if (v === 0) {
    ctx.fillStyle = '#343a40';
    ctx.beginPath();
    ctx.ellipse(307, 358, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(320, 350, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(315, 345);
    ctx.lineTo(314, 338);
    ctx.lineTo(319, 343);
    ctx.moveTo(322, 344);
    ctx.lineTo(324, 338);
    ctx.lineTo(326, 345);
    ctx.fill();
  }
}

const PAINTERS = [drawPagi, drawDanau, drawSore];

export const SCENES = [
  {
    id: 'pagi',
    diffs: [
      { id: 'sun', x: 520, y: 62, r: 30, label: 'the sun rays' },
      { id: 'kite', x: 150, y: 84, r: 28, label: 'the kite colour' },
      { id: 'birds', x: 346, y: 50, r: 26, label: 'the third bird' },
      { id: 'cushion', x: 195, y: 340, r: 28, label: 'the bench cushion' },
      { id: 'lamp', x: 470, y: 274, r: 28, label: 'the lit lamp' },
      { id: 'tulip', x: 114, y: 404, r: 26, label: 'the missing tulip' },
      { id: 'dog', x: 396, y: 372, r: 28, label: 'the dog collar' },
    ],
  },
  {
    id: 'danau',
    diffs: [
      { id: 'ducklings', x: 172, y: 368, r: 26, label: 'the third duckling' },
      { id: 'sail', x: 438, y: 264, r: 28, label: 'the sail colour' },
      { id: 'fish', x: 302, y: 324, r: 26, label: 'the jumping fish' },
      { id: 'reeds', x: 122, y: 322, r: 26, label: 'the extra reeds' },
      { id: 'bridgelamp', x: 498, y: 184, r: 28, label: 'the bridge lamp' },
      { id: 'lily', x: 252, y: 388, r: 26, label: 'the lily colour' },
      { id: 'umbrella', x: 118, y: 188, r: 30, label: 'the umbrella' },
      { id: 'swan', x: 472, y: 340, r: 30, label: 'the swan' },
    ],
  },
  {
    id: 'sore',
    diffs: [
      { id: 'sunset', x: 300, y: 135, r: 32, label: 'the setting sun' },
      { id: 'swing', x: 169, y: 300, r: 28, label: 'the swing rider' },
      { id: 'slide', x: 441, y: 330, r: 28, label: 'the slide colour' },
      { id: 'balloons', x: 498, y: 120, r: 26, label: 'the third balloon' },
      { id: 'flag', x: 92, y: 229, r: 26, label: 'the cart flag' },
      { id: 'cat', x: 307, y: 354, r: 28, label: 'the bench cat' },
      { id: 'bulbs', x: 300, y: 190, r: 26, label: 'the blue bulb' },
      { id: 'fountain', x: 382, y: 178, r: 28, label: 'the fountain water' },
      { id: 'tree', x: 56, y: 270, r: 30, label: 'the bare tree' },
      { id: 'star', x: 478, y: 66, r: 24, label: 'the extra star' },
    ],
  },
];

/** Paint one panel of `level` (0-2) as variant 0 (left) or 1 (right). */
export function drawScene(ctx, level, variant) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 600, 452);
  ctx.clip();
  PAINTERS[level](ctx, variant);
  ctx.restore();
}
