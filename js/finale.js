/* S6 – Cảnh cuối: bánh kem hạt 3D + ảnh/chữ bay chậm */
function startFinale() {
  const cv = $('cv'), ctx = cv.getContext('2d'), fx = $('fx');
  let W, H, U;
  const rs = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; U = Math.min(W, H) / 700; };
  rs(); addEventListener('resize', rs);
  const R = Math.random, TAU = Math.PI * 2;

  /* ---------- Bánh kem ---------- */
  const TIERS = [
    { r: 170, y0: 60, y1: 140, h: 335 },   // tầng dưới
    { r: 118, y0: -10, y1: 60, h: 322 },   // tầng giữa
    { r: 72,  y0: -70, y1: -10, h: 342 }   // tầng trên
  ];
  const parts = [];
  TIERS.forEach(t => {
    for (let i = 0; i < 1500; i++) {                       // thân
      const a = R() * TAU, y = t.y0 + R() * (t.y1 - t.y0);
      parts.push({ x: Math.cos(a) * t.r, y, z: Math.sin(a) * t.r, c: R(), h: t.h });
    }
    for (let i = 0; i < 600; i++) {                        // mặt trên
      const a = R() * TAU, rr = t.r * Math.sqrt(R());
      parts.push({ x: Math.cos(a) * rr, y: t.y0, z: Math.sin(a) * rr, c: .6 + R() * .4, h: t.h });
    }
    for (let d = 0; d < 16; d++) {                         // kem chảy
      const a = (d / 16) * TAU + R() * .2, len = 10 + R() * 26;
      for (let j = 0; j < 14; j++) parts.push({ x: Math.cos(a) * (t.r + 1), y: t.y0 + j / 14 * len, z: Math.sin(a) * (t.r + 1), c: 1, h: 330, w: 1 });
    }
  });
  for (let i = 0; i < 700; i++) {                          // đĩa
    const a = R() * TAU, rr = 175 + R() * 45;
    parts.push({ x: Math.cos(a) * rr, y: 141 + R() * 4, z: Math.sin(a) * rr, c: R(), h: 320 });
  }
  const cherries = Array.from({ length: 6 }, (_, i) => { const a = i / 6 * TAU; return { x: Math.cos(a) * 138, y: 56, z: Math.sin(a) * 138 }; });
  const candles = [[-26, 4], [0, -14], [26, 6]].map(([x, z]) => ({ x, z, ph: R() * 9 }));
  const stars = Array.from({ length: 140 }, () => ({ x: R(), y: R(), s: R() * 1.4 + .3, p: R() * 9 }));
  const bokeh = Array.from({ length: 34 }, () => ({ x: R(), y: R(), r: 8 + R() * 36, v: .00002 + R() * .00005, a: .04 + R() * .09, h: 310 + R() * 40 }));
  const sparks = Array.from({ length: 70 }, () => ({ a: R() * TAU, r: 120 + R() * 200, y: -120 + R() * 280, v: (R() - .5) * .0007, p: R() * 9 }));
  const embers = [];

  /* ---------- Vật thể bay ---------- */
  const items = [];
  const frame = (i, w) => {
    const e = document.createElement('div'); e.className = 'pol';
    e.style.width = w + 'px'; e.style.height = w * 1.25 + 'px'; e.style.margin = `${-w * .625}px 0 0 ${-w / 2}px`;
    e.innerHTML = `<div style='${bgi(PH[i % N])}'></div><span>Happy Birthday 💗</span>`;
    fx.appendChild(e); return e;
  };
  const cube = (i, s) => {
    const e = document.createElement('div'); e.className = 'cube';
    e.style.width = e.style.height = s + 'px'; e.style.margin = `${-s / 2}px 0 0 ${-s / 2}px`;
    const tf = ['rotateY(0)', 'rotateY(90deg)', 'rotateY(180deg)', 'rotateY(270deg)', 'rotateX(90deg)', 'rotateX(-90deg)'];
    e.innerHTML = tf.map((t, j) => `<div style='${bgi(PH[(i + j) % N])};transform:${t} translateZ(${s / 2}px)'></div>`).join('');
    fx.appendChild(e); return e;
  };
  for (let i = 0; i < 12; i++) items.push({ e: frame(i, 110 + (i % 3) * 38), k: 'p' });
  for (let i = 0; i < 6; i++)  items.push({ e: cube(i, 70 + (i % 3) * 30), k: 'c' });
  for (let i = 0; i < 14; i++) {
    const e = document.createElement('div'); e.className = 't';
    e.textContent = CONFIG.texts[i % CONFIG.texts.length]; e.style.fontSize = (16 + R() * 26) + 'px';
    fx.appendChild(e); items.push({ e, k: 't' });
  }
  const place = (o, far) => {
    const side = R() < .5 ? -1 : 1;
    o.x = side * (260 + R() * 760) * (o.k === 't' ? 1.1 : 1);   // chừa khoảng giữa cho bánh
    o.y = (R() - .5) * 860;
    o.z = far ? -2300 + R() * 300 : -2200 + R() * 2400;
    o.v = .05 + R() * .07;                                      // bay chậm
    o.ph = R() * 9; o.sw = .25 + R() * .35;
    o.rz = (R() - .5) * 16; o.spin = (R() - .5) * .006; o.r = R() * 360;
  };
  items.forEach(o => place(o, false));

  /* ---------- Vòng lặp ---------- */
  const t0 = performance.now(); let last = t0;
  (function loop(now) {
    const dt = Math.min(40, now - last); last = now;
    const t = now - t0, ang = t * .00032, reveal = Math.min(1, t / 4200);
    const ca = Math.cos(ang), sa = Math.sin(ang), tilt = .34, ct = Math.cos(tilt), st = Math.sin(tilt);
    const cx = W / 2, cy = H * .64, F = 560, S = U * 1.15;
    const P3 = (x, y, z) => {
      const xr = x * ca - z * sa, zr = x * sa + z * ca, yr = y * ct - zr * st, zz = y * st + zr * ct, k = F / (F + zz + 420);
      return [cx + xr * k * S, cy + yr * k * S, k];
    };
    ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#fff';                                      // sao
    stars.forEach(s => { ctx.globalAlpha = .25 + .55 * Math.abs(Math.sin(t * .001 * s.s + s.p)); ctx.fillRect(s.x * W, s.y * H, s.s, s.s); });
    ctx.globalCompositeOperation = 'lighter';
    bokeh.forEach(b => {                                         // bokeh hồng
      b.y -= b.v * dt; if (b.y < -.1) { b.y = 1.1; b.x = R(); }
      const g = ctx.createRadialGradient(b.x * W, b.y * H, 0, b.x * W, b.y * H, b.r * U);
      g.addColorStop(0, `hsla(${b.h},90%,70%,${b.a})`); g.addColorStop(1, `hsla(${b.h},90%,60%,0)`);
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x * W, b.y * H, b.r * U, 0, TAU); ctx.fill();
    });
    const gl = ctx.createRadialGradient(cx, cy + 90 * S, 10, cx, cy + 90 * S, 330 * S);   // ánh sáng dưới bánh
    gl.addColorStop(0, 'rgba(255,60,170,.35)'); gl.addColorStop(1, 'rgba(255,60,170,0)');
    ctx.globalAlpha = 1; ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);

    for (const p of parts) {                                     // hạt bánh (hiện dần từ dưới lên)
      const ny = (p.y + 70) / 215; if (ny < 1 - reveal * 1.15) continue;
      const [px, py, k] = P3(p.x, p.y, p.z), s = (p.w ? 2.2 : 1.7) * k * U + .5;
      ctx.globalAlpha = p.w ? .95 : .55 + p.c * .4;
      ctx.fillStyle = `hsl(${p.h + p.c * 14},${p.w ? 40 : 88}%,${p.w ? 90 : 52 + p.c * 24}%)`;
      ctx.fillRect(px, py, s, s);
    }
    ctx.globalAlpha = 1; ctx.lineJoin = 'round';
    const ring = (r, y, wave, col, w, blur) => {                 // viền neon
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const a = i / 90 * TAU, [x, yy] = P3(Math.cos(a) * r, y + (wave ? Math.sin(a * 9) * 5 : 0), Math.sin(a) * r);
        i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy);
      }
      ctx.strokeStyle = col; ctx.lineWidth = w * U; ctx.shadowColor = '#ff2fa0'; ctx.shadowBlur = blur; ctx.stroke(); ctx.shadowBlur = 0;
    };
    if (reveal > .25) { ring(175, 142, 0, '#ff5cc0', 2.2, 18); ring(215, 143, 0, '#ff8ad2aa', 1.4, 12); }
    if (reveal > .5)  { ring(170, 60, 1, '#ff63c4', 2, 16); ring(170, 140, 0, '#ff63c4', 1.6, 10); }
    if (reveal > .7)  { ring(118, -10, 1, '#ff7ed0', 2, 16); ring(118, 60, 0, '#ff7ed0', 1.4, 10); }
    if (reveal > .85) { ring(72, -70, 1, '#ffa0dc', 2, 16); ring(72, -10, 0, '#ffa0dc', 1.4, 10); }

    if (reveal > .9) {
      cherries.forEach(c => {                                    // cherry
        const [px, py, k] = P3(c.x, c.y, c.z), r = 9 * k * U;
        const g = ctx.createRadialGradient(px - r / 3, py - r / 3, 1, px, py, r);
        g.addColorStop(0, '#ffd0d8'); g.addColorStop(.35, '#ff3c6e'); g.addColorStop(1, '#a30f3a');
        ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = g; ctx.shadowColor = '#ff2f6a'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(px, py, r, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
      });
      candles.forEach(c => {                                     // nến + lửa
        const [bx, by, k] = P3(c.x, -70, c.z), [tx, ty] = P3(c.x, -108, c.z);
        ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = '#ffe9a8'; ctx.lineWidth = 5 * k * U; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
        const fl = 1 + Math.sin(t * .02 + c.ph) * .12, fr = 15 * U * k * fl;
        ctx.globalCompositeOperation = 'lighter';
        const g = ctx.createRadialGradient(tx, ty - fr * .5, 1, tx, ty - fr * .5, fr * 2.6);
        g.addColorStop(0, 'rgba(255,240,170,1)'); g.addColorStop(.25, 'rgba(255,170,60,.7)'); g.addColorStop(1, 'rgba(255,90,30,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tx, ty - fr * .5, fr * 2.6, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(tx, ty - fr * .8, fr * .38, fr * .85, 0, 0, TAU); ctx.fillStyle = '#fff6c8'; ctx.fill();
        if (R() < .08) embers.push({ x: tx, y: ty - fr, vx: (R() - .5) * .02, vy: -.03 - R() * .03, l: 1 });
      });
    }
    ctx.globalCompositeOperation = 'lighter';
    for (let i = embers.length - 1; i >= 0; i--) {               // tàn lửa
      const e = embers[i]; e.x += e.vx * dt; e.y += e.vy * dt; e.l -= dt * .0006;
      if (e.l <= 0) { embers.splice(i, 1); continue; }
      ctx.globalAlpha = e.l; ctx.fillStyle = '#ffc060'; ctx.fillRect(e.x, e.y, 2 * U, 2 * U);
    }
    sparks.forEach(s => {                                        // lấp lánh quanh bánh
      s.a += s.v * dt;
      const [px, py, k] = P3(Math.cos(s.a) * s.r, s.y, Math.sin(s.a) * s.r), a = Math.max(0, Math.sin(t * .003 + s.p)), L = (3 + a * 6) * k * U;
      ctx.globalAlpha = a * .9; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px - L, py); ctx.lineTo(px + L, py); ctx.moveTo(px, py - L); ctx.lineTo(px, py + L); ctx.stroke();
    });
    ctx.globalAlpha = 1;

    for (const o of items) {                                     // ảnh & chữ bay chậm
      o.z += o.v * dt;
      if (o.z > 380) place(o, true);
      const op = Math.max(0, Math.min(1, (o.z + 2300) / 700, (420 - o.z) / 300)) * (o.k === 't' ? .95 : 1);
      const bob = Math.sin(t * .0006 * o.sw * 3 + o.ph) * 16;
      o.e.style.opacity = op;
      if (o.k === 'p') o.e.style.transform = `translate3d(${o.x}px,${o.y + bob}px,${o.z}px) rotateZ(${o.rz}deg) rotateY(${Math.sin(t * .0005 * o.sw * 2 + o.ph) * 32}deg)`;
      else if (o.k === 'c') { o.r += o.spin * dt; o.e.style.transform = `translate3d(${o.x}px,${o.y + bob}px,${o.z}px) rotateX(${o.r * .6 + 20}deg) rotateY(${o.r}deg)`; }
      else o.e.style.transform = `translate3d(${o.x - 80}px,${o.y + bob}px,${o.z}px) rotateZ(${o.rz / 2}deg)`;
    }
    requestAnimationFrame(loop);
  })(last);
}
