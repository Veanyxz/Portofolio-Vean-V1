// public/card3d.js
// Hero ID card, rendered in WebGL (three.js r165, vendored — no build step).
//
// Why real geometry instead of CSS 3D: a CSS transform can only spin a flat
// rectangle, so it never catches light on an edge and never shows thickness.
// Here the card is an extruded rounded slab with a physical material, and the
// artwork is painted into two canvas textures. Springs drive rotation, so the
// card has mass: it leans toward the pointer, drifts on its own, and swings
// when you spin it.
//
// Zero network deps, CSP-safe ('self' only).

import * as THREE from "./vendor/three.module.min.js";

const stage = document.getElementById("card3d-stage");
const canvas = document.getElementById("card3d-canvas");
if (stage && canvas) boot();

function boot() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (e) {
    stage.classList.add("no-webgl");
    return;
  }
  if (!renderer.getContext()) {
    stage.classList.add("no-webgl");
    return;
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- scene ---------- */
  const W = 2, H = 3, D = 0.085, R = 0.1; // world units; 2:3 like a real ID
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 100);
  camera.position.set(0, 0, 8.1);

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  if ("toneMapping" in renderer) renderer.toneMapping = THREE.ACESFilmicToneMapping;
  if ("toneMappingExposure" in renderer) renderer.toneMappingExposure = 1.12;

  /* ---------- lights: key, fill, green rim ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.62));

  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(3.2, 4.4, 6);
  scene.add(key);

  const rim = new THREE.PointLight(0x00ff9c, 11, 22, 2);
  rim.position.set(-3.4, -2.2, 3.4);
  scene.add(rim);

  const fill = new THREE.PointLight(0x9effd8, 3.2, 16, 2);
  fill.position.set(2.6, -3, 4);
  scene.add(fill);

  /* ---------- geometry: rounded slab with a beveled edge ---------- */
  function roundedRect(w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }

  const bodyGeo = new THREE.ExtrudeGeometry(roundedRect(W, H, R), {
    depth: D,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 16,
  });
  bodyGeo.translate(0, 0, -D / 2);

  // no environment map is loaded, so a high metalness has nothing to reflect and
  // renders black. Keep it low and let clearcoat + lights do the work.
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x122c22,
    metalness: 0.16,
    roughness: 0.42,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
    reflectivity: 0.42,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  scene.add(bodyMesh);

  const card = new THREE.Group();
  card.add(bodyMesh);
  scene.add(card);

  /* ---------- artwork painted into canvas textures ---------- */
  // Texture space is authored in these logical units, then painted at S× so the
  // artwork out-resolves the card on a 2x screen (554 CSS px wide = 1108 device
  // px; a 1024px texture would have been upscaled by the GPU and read as mush).
  const TW = 1024, TH = 1536; // 2:3
  const TSCALE = 1.5;

  function mkCanvas() {
    const c = document.createElement("canvas");
    c.width = Math.round(TW * TSCALE);
    c.height = Math.round(TH * TSCALE);
    // scale once, so every literal below stays in logical units
    const ctx = c.getContext("2d");
    ctx.scale(TSCALE, TSCALE);
    return c;
  }

  function roundPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  const HEAD = '"Space Grotesk", system-ui, -apple-system, sans-serif';
  const MONO = '"JetBrains Mono", ui-monospace, monospace';
  const ACCENT = "#00ff9c";

  function base(ctx) {
    // same palette as the page: deep green glass, not a flat swatch
    const g = ctx.createLinearGradient(0, 0, TW * 0.4, TH);
    g.addColorStop(0, "#0d271e");
    g.addColorStop(0.46, "#071812");
    g.addColorStop(1, "#040d09");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, TW, TH);

    const glow = ctx.createRadialGradient(TW / 2, TH * 0.26, 0, TW / 2, TH * 0.26, TW * 0.86);
    glow.addColorStop(0, "rgba(0,255,156,.20)");
    glow.addColorStop(0.62, "rgba(0,255,156,.03)");
    glow.addColorStop(1, "rgba(0,255,156,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, TW, TH);

    // hairline inset frame
    roundPath(ctx, 26, 26, TW - 52, TH - 52, 44);
    ctx.strokeStyle = "rgba(0,255,156,.22)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function barcode(ctx, x, y, w, h) {
    // deterministic bars so the same card always paints the same pattern
    let seed = 7;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    let cx = x;
    ctx.fillStyle = "rgba(0,255,156,.5)";
    while (cx < x + w) {
      const bw = 2 + Math.floor(rnd() * 5);
      if (rnd() > 0.36) ctx.fillRect(cx, y, bw, h);
      cx += bw + 3 + Math.floor(rnd() * 4);
    }
  }

  function chip(ctx, x, y, w, h) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, "rgba(0,255,156,.62)");
    g.addColorStop(1, "rgba(0,196,122,.28)");
    roundPath(ctx, x, y, w, h, 8);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,255,156,.55)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = "rgba(4,18,12,.7)";
    ctx.beginPath();
    ctx.moveTo(x + w * 0.32, y + 5);
    ctx.lineTo(x + w * 0.32, y + h - 5);
    ctx.moveTo(x + w * 0.66, y + 5);
    ctx.lineTo(x + w * 0.66, y + h - 5);
    ctx.stroke();
  }

  /* unsharp mask: the source photo is 460px and the well is 900px, so the
     bilinear upscale softens it, then the GPU downscales again — two resamples
     of mush. One sharpen pass at paint time puts the acutance back. */
  function sharpen(ctx, x, y, w, h, amount) {
    const img = ctx.getImageData(x, y, w, h);
    const d = img.data;
    const src = new Uint8ClampedArray(d);
    const stride = w * 4;
    for (let j = 1; j < h - 1; j++) {
      for (let i = 1; i < w - 1; i++) {
        const o = j * stride + i * 4;
        for (let c = 0; c < 3; c++) {
          const center = src[o + c];
          const blur = (
            src[o - stride - 4 + c] + src[o - stride + c] + src[o - stride + 4 + c] +
            src[o - 4 + c] + center + src[o + 4 + c] +
            src[o + stride - 4 + c] + src[o + stride + c] + src[o + stride + 4 + c]
          ) / 9;
          d[o + c] = center + (center - blur) * amount;
        }
      }
    }
    ctx.putImageData(img, x, y);
  }

  function drawFront(photo) {
    const c = mkCanvas();
    const ctx = c.getContext("2d");
    base(ctx);

    // header
    ctx.fillStyle = "rgba(0,255,156,.9)";
    ctx.font = `600 26px ${MONO}`;
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "4px";
    ctx.fillText("VEAN.MY.ID", 62, 96);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
    chip(ctx, TW - 148, 78, 86, 58);

    // photo well
    const px = 62, py = 168, pw = TW - 124, ph = 720;
    ctx.save();
    roundPath(ctx, px, py, pw, ph, 34);
    ctx.clip();
    if (photo) {
      // cover-crop, eye line kept high like an ID photo
      const ir = photo.width / photo.height;
      const br = pw / ph;
      let sw = photo.width, sh = photo.height, sx = 0, sy = 0;
      if (ir > br) { sw = photo.height * br; sx = (photo.width - sw) / 2; }
      else { sh = photo.width / br; sy = photo.height * 0.16; }
      // high-quality resampling: the sharpening pass below assumes the upscale
      // was as clean as the browser can make it
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(photo, sx, sy, sw, sh, px, py, pw, ph);
      // getImageData/putImageData ignore the canvas transform, so the well has to
      // be addressed in device pixels (logical × TSCALE) or we'd sharpen the
      // wrong region entirely
      sharpen(
        ctx,
        Math.round(px * TSCALE), Math.round(py * TSCALE),
        Math.round(pw * TSCALE), Math.round(ph * TSCALE),
        0.85
      );
    } else {
      ctx.fillStyle = "rgba(255,255,255,.05)";
      ctx.fillRect(px, py, pw, ph);
    }
    // neutral fade at the bottom only — no colour cast over the face
    const vg = ctx.createLinearGradient(0, py + ph * 0.62, 0, py + ph);
    vg.addColorStop(0, "rgba(4,13,9,0)");
    vg.addColorStop(1, "rgba(4,13,9,.85)");
    ctx.fillStyle = vg;
    ctx.fillRect(px, py, pw, ph);
    ctx.restore();

    roundPath(ctx, px, py, pw, ph, 34);
    ctx.strokeStyle = "rgba(255,255,255,.13)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // name + role
    ctx.fillStyle = "#eafff6";
    ctx.font = `700 116px ${HEAD}`;
    ctx.textBaseline = "alphabetic";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "-3px";
    ctx.fillText("Vean", 58, py + ph + 118);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

    ctx.fillStyle = "rgba(0,255,156,.82)";
    ctx.font = `500 27px ${MONO}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";
    ctx.fillText("FULL-STACK · SECURITY · AUTOMATION", 60, py + ph + 172);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

    // footer rule + id block
    const fy = TH - 132;
    ctx.strokeStyle = "rgba(0,255,156,.16)";
    ctx.beginPath();
    ctx.moveTo(62, fy - 44);
    ctx.lineTo(TW - 62, fy - 44);
    ctx.stroke();

    ctx.fillStyle = "rgba(231,239,235,.72)";
    ctx.font = `500 26px ${MONO}`;
    ctx.fillText("ID · 50613879", 62, fy + 8);
    barcode(ctx, 62, fy + 28, 300, 44);

    ctx.fillStyle = "rgba(0,255,156,.5)";
    ctx.font = `500 22px ${MONO}`;
    ctx.textAlign = "right";
    ctx.fillText("SURABAYA · ID", TW - 62, fy + 22);
    ctx.textAlign = "left";

    return c;
  }

  function drawBack() {
    const c = mkCanvas();
    const ctx = c.getContext("2d");
    base(ctx);

    ctx.fillStyle = "rgba(0,255,156,.86)";
    ctx.font = `600 25px ${MONO}`;
    ctx.textBaseline = "middle";
    if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";
    ctx.fillText("IF FOUND · ADMIN@VEAN.MY.ID", 62, 100);
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

    ctx.strokeStyle = "rgba(0,255,156,.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(62, 158);
    ctx.lineTo(TW - 62, 158);
    ctx.stroke();

    // pull quote
    ctx.fillStyle = "#eafff6";
    ctx.font = `700 62px ${HEAD}`;
    ctx.textBaseline = "alphabetic";
    ctx.fillText("“Ship it, then", 62, 300);
    ctx.fillText("make it better.”", 62, 378);

    ctx.fillStyle = "rgba(231,239,235,.62)";
    ctx.font = `400 30px ${HEAD}`;
    wrap(ctx, "Web apps, automation and security tooling — built to survive real traffic, not just a demo.", 62, 470, TW - 124, 44);

    // contact rows
    const rows = [
      ["MAIL", "admin@vean.my.id"],
      ["GITHUB", "github.com/Veanyxz"],
      ["WEB", "vean.my.id"],
      ["LOC", "Surabaya, ID"],
    ];
    let ry = 700;
    ctx.strokeStyle = "rgba(0,255,156,.14)";
    ctx.beginPath();
    ctx.moveTo(62, ry - 46);
    ctx.lineTo(TW - 62, ry - 46);
    ctx.stroke();

    rows.forEach(([k, v]) => {
      ctx.fillStyle = "rgba(0,255,156,.5)";
      ctx.font = `500 21px ${MONO}`;
      if ("letterSpacing" in ctx) ctx.letterSpacing = "3px";
      ctx.fillText(k, 62, ry);
      if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";

      ctx.fillStyle = "rgba(231,239,235,.86)";
      ctx.font = `400 30px ${MONO}`;
      ctx.textAlign = "right";
      ctx.fillText(v, TW - 62, ry);
      ctx.textAlign = "left";

      ry += 86;
      ctx.strokeStyle = "rgba(0,255,156,.08)";
      ctx.beginPath();
      ctx.moveTo(62, ry - 30);
      ctx.lineTo(TW - 62, ry - 30);
      ctx.stroke();
    });

    // signature
    ctx.save();
    ctx.translate(TW - 210, TH - 210);
    ctx.rotate(-0.06);
    ctx.fillStyle = "rgba(0,255,156,.86)";
    ctx.font = `italic 700 84px ${HEAD}`;
    ctx.textAlign = "center";
    ctx.fillText("Vean", 0, 0);
    ctx.strokeStyle = "rgba(0,255,156,.35)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-96, 22);
    ctx.lineTo(96, 22);
    ctx.stroke();
    ctx.restore();

    barcode(ctx, 62, TH - 150, 340, 46);
    return c;
  }

  function wrap(ctx, text, x, y, maxW, lh) {
    const words = text.split(" ");
    let line = "";
    words.forEach((w) => {
      const t = line ? line + " " + w : w;
      if (ctx.measureText(t).width > maxW && line) {
        ctx.fillText(line, x, y);
        y += lh;
        line = w;
      } else {
        line = t;
      }
    });
    if (line) ctx.fillText(line, x, y);
  }

  function texFrom(cv) {
    const t = new THREE.CanvasTexture(cv);
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    if ("colorSpace" in t) t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }

  // The faces are printed artwork, not a lit surface: a Basic material shows the
  // texture exactly as painted. With the physical material the green rim light
  // (0x00ff9c, intensity 11) cast a green wash straight over the photo.
  const faceMat = () =>
    new THREE.MeshBasicMaterial({
      transparent: true,
      toneMapped: false,
    });

  // the extruded slab spans ±(D/2 + bevelThickness); a face plane at D/2 sits
  // INSIDE the body and is never visible. Push it past the bevel.
  const FACE_Z = D / 2 + 0.012 + 0.002;

  const frontPlane = new THREE.Mesh(new THREE.PlaneGeometry(W, H), faceMat());
  frontPlane.position.z = FACE_Z;
  card.add(frontPlane);

  const backPlane = new THREE.Mesh(new THREE.PlaneGeometry(W, H), faceMat());
  backPlane.position.z = -FACE_Z;
  backPlane.rotation.y = Math.PI;
  card.add(backPlane);

  /* ---------- springs ---------- */
  // near-critically damped: settles without wobble, still reads as mass
  const S = 120, C = 20.5; // 2*sqrt(120) ≈ 21.9
  const mk = (v = 0) => ({ x: v, v: 0, t: v });
  const sRX = mk(), sRY = mk();
  const sFlip = { x: 0, v: 0, t: 0 };   // the turn itself

  const TILT_X = 0.15, TILT_Y = 0.22; // radians at the card edge
  let pointerOn = false;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function step(s, dt, stiff = S, damp = C) {
    const a = (s.t - s.x) * stiff - s.v * damp;
    s.v += a * dt;
    s.x += s.v * dt;
  }

  function atRest() {
    // No `!pointerOn` here: a still pointer over the card leaves the springs
    // converged, and including the hover flag pinned the loop at 60fps forever.
    return !dragging &&
      Math.abs(sRX.x - sRX.t) < 0.0004 && Math.abs(sRX.v) < 0.0004 &&
      Math.abs(sRY.x - sRY.t) < 0.0004 && Math.abs(sRY.v) < 0.0004 &&
      Math.abs(sFlip.x - sFlip.t) < 0.0006 && Math.abs(sFlip.v) < 0.0006;
  }

  /* ---------- pointer ---------- */
  let dragging = false, moved = 0, lastX = 0, downX = 0;
  let spin = 0, spinV = 0;              // free spin while dragging
  let flipTarget = 0;                   // 0 or PI

  if (fine && !reduce) {
    stage.addEventListener("pointermove", (e) => {
      if (dragging) return;
      const r = stage.getBoundingClientRect();
      const px = clamp((e.clientX - r.left) / Math.max(r.width, 1), 0, 1);
      const py = clamp((e.clientY - r.top) / Math.max(r.height, 1), 0, 1);
      pointerOn = true;
      sRY.t = (px - 0.5) * 2 * TILT_Y;
      sRX.t = -(py - 0.5) * 2 * TILT_X;
      kick();
    });
    stage.addEventListener("pointerleave", () => {
      if (dragging) return;
      pointerOn = false;
      sRX.t = 0;
      sRY.t = 0;
      kick();
    });
  }

  stage.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    moved = 0;
    downX = e.clientX;
    lastX = e.clientX;
    spin = sFlip.x;            // continue from the current angle, not the target
    spinV = 0;
    stage.classList.add("grabbing");
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    kick();
  });

  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    moved = Math.max(moved, Math.abs(e.clientX - downX));
    spin += dx * 0.011;
    spinV = dx * 0.011;
    kick();
  });

  function release(e) {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("grabbing");
    if (e && e.pointerId != null) {
      try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
    }

    if (moved < 8) {
      // a tap is a deliberate turn to the next face — never a partial angle
      flipTarget = sFlip.t + Math.PI;
      sFlip.x = sFlip.t;
      sFlip.v = 0;
    } else {
      // a drag keeps its momentum, then snaps to whichever face is closest
      spin += spinV * 8;
      flipTarget = Math.round(spin / Math.PI) * Math.PI;
      sFlip.x = spin;
      sFlip.v = spinV * 8;
    }
    spin = sFlip.x;
    kick();
  }
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);

  // Space flips. Enter belongs to app.js (opens the photo lightbox), so this
  // handler deliberately does not claim it.
  stage.addEventListener("keydown", (e) => {
    if (e.key !== " ") return;
    e.preventDefault();
    flipTarget += Math.PI;
    kick();
  });

  /* ---------- loop ---------- */
  // Two speeds: full rAF while something is actually moving, a slow timer while
  // the card only breathes on its idle sine. Rendering a static card at 60fps
  // burned a GPU core for nothing; parking it entirely killed the float.
  let raf = null, idleTimer = null, lastT = 0, t0 = performance.now();
  let onScreen = true;

  const IDLE_MS = 55;          // ~18fps idle breath
  const IDLE_AMP = 0.045;
  const IDLE_AMP_REDUCED = 0;

  function scheduleIdle() {
    if (raf || idleTimer) return;
    idleTimer = window.setTimeout(() => {
      idleTimer = null;
      if (!onScreen || document.hidden || reduce) return;
      frame(performance.now());
    }, IDLE_MS);
  }

  function frame(now) {
    raf = null;
    if (!lastT) lastT = now;
    let dt = (now - lastT) / 1000;
    lastT = now;
    if (!(dt > 0)) dt = 1 / 60;
    if (dt > 1 / 20) dt = 1 / 20;   // a parked loop resumes with a big dt; clamp it

    step(sRX, dt);
    step(sRY, dt);

    // the turn: while held, the pointer owns it; on release the spring carries
    // the leftover inertia and settles exactly on the nearest face (n * PI)
    sFlip.t = flipTarget;
    if (!dragging) step(sFlip, dt, 52, 10.4);   // slower + soft overshoot reads as weight

    const idle = reduce ? 0 : Math.sin((now - t0) * 0.00068) * IDLE_AMP;
    card.position.y = idle;
    card.rotation.x = sRX.x;
    card.rotation.y = sRY.x + (dragging ? spin : sFlip.x);
    card.rotation.z = reduce ? 0 : Math.sin((now - t0) * 0.00051 + 1.1) * 0.014;

    // rim light follows the tilt so the edge highlight moves with the card
    rim.position.x = -3.4 - sRY.x * 5;
    rim.position.y = -2.2 + sRX.x * 5;

    renderer.render(scene, camera);

    if (atRest()) scheduleIdle();
    else kick();
  }

  function kick() {
    if (raf) return;
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
    lastT = 0;
    raf = requestAnimationFrame(frame);
  }

  // Stop rendering while the hero is scrolled away or the tab is hidden.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      for (const e of entries) {
        onScreen = e.isIntersecting;
        if (onScreen) kick();
        else if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
      }
    }, { rootMargin: "120px" }).observe(stage);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
    } else {
      kick();
    }
  });

  /* ---------- sizing ---------- */
  function resize() {
    const r = stage.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width));
    const h = Math.max(1, Math.round(r.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    kick();
  }

  // read-only probe so automated checks can assert the card really moved
  window.__c3d = {
    rot: () => ({ x: card.rotation.x, y: card.rotation.y, z: card.rotation.z }),
    face: () => Math.round(sFlip.t / Math.PI) % 2,
    // the painted artwork, before the GPU touches it — lets a check prove the
    // photo and text really made it into the texture
    tex: (which) => (which === "back" ? backCv : frontCv).toDataURL("image/png"),
    // numeric stats of the photo well, computed on the texture itself. Measuring
    // the screenshot instead is misleading: the 3D card doesn't fill its stage,
    // so the dark page background bleeds into the sample.
    well: (which) => {
      const cv = which === "back" ? backCv : frontCv;
      if (!cv) return null;
      const ctx = cv.getContext("2d");
      const x0 = Math.round(62 * TSCALE), x1 = Math.round((62 + 900) * TSCALE);
      const y0 = Math.round(168 * TSCALE), y1 = Math.round((168 + 720) * TSCALE);
      const img = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data;
      const w = x1 - x0;
      let sr = 0, sg = 0, sb = 0, greenish = 0, n = 0;
      for (let i = 0; i < img.length; i += 4) {
        const r = img[i], g = img[i + 1], b = img[i + 2];
        sr += r; sg += g; sb += b; n++;
        if (g > r + 12 && g > b + 5) greenish++;
      }
      // acutance: mean |laplacian| on luma, a proxy for edge crispness
      let lap = 0, ln = 0;
      const lum = (x, y) => {
        const o = (y * w + x) * 4;
        return (img[o] * 299 + img[o + 1] * 587 + img[o + 2] * 114) / 1000;
      };
      for (let y = 1; y < (y1 - y0) - 1; y += 3) {
        for (let x = 1; x < w - 1; x += 3) {
          lap += Math.abs(4 * lum(x, y) - lum(x - 1, y) - lum(x + 1, y) - lum(x, y - 1) - lum(x, y + 1));
          ln++;
        }
      }
      return {
        mean: { r: +(sr / n).toFixed(1), g: +(sg / n).toFixed(1), b: +(sb / n).toFixed(1) },
        gMinusR: +((sg - sr) / n).toFixed(2),
        greenPct: +((100 * greenish) / n).toFixed(2),
        acutance: +(lap / ln).toFixed(2),
        size: [cv.width, cv.height],
      };
    },
  };

  /* ---------- boot ---------- */
  let frontCv = null, backCv = null;

  function paint(photoImg) {
    frontCv = drawFront(photoImg);
    backCv = drawBack();
    const front = texFrom(frontCv);
    const back = texFrom(backCv);
    frontPlane.material.map = front;
    frontPlane.material.needsUpdate = true;
    backPlane.material.map = back;
    backPlane.material.needsUpdate = true;
    stage.classList.add("ready");
  }

  resize();
  window.addEventListener("resize", resize);
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);

  // fonts must be ready before the canvas is painted, or text falls back mid-draw
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  const photoReady = new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = "me.jpg";
  });

  Promise.all([fontsReady, photoReady]).then(([, img]) => {
    paint(img);
    kick();
  }).catch(() => {
    paint(null);
    kick();
  });

  // keep spinning on reduced-motion: draw one frame so the card is never blank
  if (reduce) {
    card.rotation.set(0, 0, 0);
    renderer.render(scene, camera);
  }
}
