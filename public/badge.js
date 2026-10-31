// public/badge.js
// Hanging ID badge on a stretchable verlet rope.
// Drag = pull the cord out (it lengthens), release = it snaps back and swings.
// No card flip. Green theme, zero dependencies.

(function () {
  "use strict";

  var stage = document.getElementById("badge");
  if (!stage) return;

  var body = stage.querySelector(".badge-body");
  var card = stage.querySelector(".id-card");
  var path = stage.querySelector(".badge-rope-line");
  var band = stage.querySelector(".badge-rope-band");
  if (!body || !card || !path) return;

  var NS = "http://www.w3.org/2000/svg";

  var N = 7;                    // rope nodes
  var SEG = 13;                 // rest segment length (px) -> 78px cord
  var REST = SEG * (N - 1);
  var MAXPULL = 2.25;           // cord can stretch to 2.25x its rest length
  var GRAV = 0.58;
  var DAMP = 0.962;
  var ITER = 9;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var pts = [];
  var seg = SEG;                // current animated segment length
  var cx = 0, stageW = 0, cardH = 0;

  var dragging = false, moved = 0, downX = 0, downY = 0;
  var tgtX = 0, tgtY = 0;
  var tiltX = 0, tiltY = 0, cTiltX = 0, cTiltY = 0;
  var press = 0, tPress = 0;
  var raf = null;

  function measure() {
    stageW = stage.clientWidth || 292;
    cx = stageW / 2;
    cardH = card.offsetHeight || Math.round(stageW * 1.5);
    stage.style.setProperty("--cord", REST + "px");
    stage.style.height = Math.ceil(REST + cardH + 26) + "px";
    var svg = path.ownerSVGElement;
    svg.setAttribute("viewBox", "0 0 " + stageW + " " + (REST + cardH + 26));
    svg.setAttribute("width", String(stageW));
    svg.setAttribute("height", String(REST + cardH + 26));
  }

  function reset() {
    pts = [];
    for (var i = 0; i < N; i++) {
      pts.push({ x: 0, y: i * SEG, px: 0, py: i * SEG });
    }
    seg = SEG;
  }

  function draw() {
    var d = "M " + cx + " 0";
    for (var i = 0; i < N; i++) {
      d += " L " + (cx + pts[i].x).toFixed(2) + " " + pts[i].y.toFixed(2);
    }
    path.setAttribute("d", d);
    if (band) band.setAttribute("d", d);

    var tail = pts[N - 1];
    var prev = pts[N - 2];
    var ang = Math.atan2(tail.x - prev.x, tail.y - prev.y) * 180 / Math.PI;

    body.style.transform =
      "translate(" + tail.x.toFixed(2) + "px," + tail.y.toFixed(2) + "px) rotate(" +
      ang.toFixed(3) + "deg)";
  }

  function step() {
    raf = null;

    // target segment length: stretched while dragged, rest otherwise
    var goal = SEG;
    if (dragging) {
      var dx = tgtX - cx, dy = tgtY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      goal = Math.min(Math.max(dist / (N - 1), SEG), SEG * MAXPULL);
    }
    seg += (goal - seg) * (dragging ? 0.34 : 0.16);
    if (!dragging && Math.abs(seg - SEG) < 0.02) seg = SEG;

    // verlet integrate (node 0 is pinned to the anchor)
    for (var i = 1; i < N; i++) {
      var p = pts[i];
      var vx = (p.x - p.px) * DAMP;
      var vy = (p.y - p.py) * DAMP;
      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy + GRAV;
    }

    // distance constraints, segment length = seg so the cord visibly lengthens
    for (var k = 0; k < ITER; k++) {
      pts[0].x = 0; pts[0].y = 0;
      for (var j = 0; j < N - 1; j++) {
        var a = pts[j], b = pts[j + 1];
        var ddx = b.x - a.x, ddy = b.y - a.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy) || 0.0001;
        var diff = (seg - d) / d;
        var ox = ddx * diff * 0.5, oy = ddy * diff * 0.5;
        if (j === 0) { b.x += ox * 2; b.y += oy * 2; }
        else { a.x -= ox; a.y -= oy; b.x += ox; b.y += oy; }
      }
      // while dragging, the tail chases the pointer
      if (dragging) {
        var tp = pts[N - 1];
        tp.x += (tgtX - cx - tp.x) * 0.55;
        tp.y += (tgtY - tp.y) * 0.55;
      }
    }

    cTiltX += (tiltX - cTiltX) * 0.14;
    cTiltY += (tiltY - cTiltY) * 0.14;
    press += (tPress - press) * 0.22;
    card.style.setProperty("--rotx", cTiltY.toFixed(2) + "deg");
    card.style.setProperty("--roty", cTiltX.toFixed(2) + "deg");
    card.style.setProperty("--press", press.toFixed(3));

    draw();

    // park the loop once the cord is at rest and nothing moves
    var tail = pts[N - 1];
    var still = Math.abs(tail.x) < 0.06 && Math.abs(tail.y - REST) < 0.06 &&
                Math.abs(seg - SEG) < 0.02 && !dragging &&
                Math.abs(tiltX - cTiltX) < 0.05 && Math.abs(press - tPress) < 0.01;
    if (!still) raf = requestAnimationFrame(step);
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(step);
  }

  /* ---------- cursor tilt + glare ---------- */
  if (fine && !reduce) {
    stage.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / Math.max(r.width, 1);
      var py = (e.clientY - r.top) / Math.max(r.height, 1);
      if (!dragging) {
        tiltX = (px - 0.5) * 2 * 12;
        tiltY = -(py - 0.5) * 2 * 10;
      }
      card.style.setProperty("--mx", (Math.min(Math.max(px, 0), 1) * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (Math.min(Math.max(py, 0), 1) * 100).toFixed(1) + "%");
      kick();
    });
    stage.addEventListener("pointerleave", function () {
      if (dragging) return;
      tiltX = 0; tiltY = 0;
      kick();
    });
  }

  /* native HTML5 drag + text selection would cancel the pointer stream */
  stage.addEventListener("dragstart", function (e) { e.preventDefault(); });
  stage.addEventListener("selectstart", function (e) { e.preventDefault(); });
  stage.querySelectorAll("img").forEach(function (im) {
    im.setAttribute("draggable", "false");
    im.addEventListener("dragstart", function (e) { e.preventDefault(); });
  });

  /* ---------- drag the cord ---------- */
  function point(e) {
    var r = stage.getBoundingClientRect();
    var x = e.clientX - r.left;
    var y = e.clientY - r.top;
    // clamp inside a sane envelope so the cord never detaches from the anchor
    var dx = x - cx;
    var maxR = REST * MAXPULL;
    var d = Math.sqrt(dx * dx + y * y);
    if (d > maxR) { dx = dx / d * maxR; y = y / d * maxR; }
    if (y < 10) y = 10;
    tgtX = cx + dx;
    tgtY = y;
  }

  stage.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    dragging = true;
    moved = 0;
    downX = e.clientX;
    downY = e.clientY;
    point(e);
    tPress = 1;
    card.classList.add("pressed");
    stage.classList.add("grabbing");
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    kick();
  });

  stage.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    moved = Math.max(moved, Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY));
    point(e);
    kick();
  });

  function release(e) {
    if (!dragging) return;
    dragging = false;
    tPress = 0;
    card.classList.remove("pressed");
    stage.classList.remove("grabbing");
    if (e && e.pointerId != null) {
      try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    // hand the recoil to verlet: the cord springs back on its own
    var tail = pts[N - 1];
    tail.px = tail.x + (tail.x - pts[N - 2].x) * 1.4;
    tail.py = tail.y + 4;
    kick();
  }
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);

  stage.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    // keyboard pull: yank the cord down, let it spring
    var tail = pts[N - 1];
    tail.y += 54;
    tail.py = tail.y - 22;
    kick();
  });

  measure();
  reset();
  draw();

  window.addEventListener("resize", function () {
    var oldW = stageW;
    measure();
    if (oldW && Math.abs(oldW - stageW) > 2) {
      reset();
      draw();
    }
  });

  if (reduce) {
    body.style.transform = "translate(0px," + REST + "px) rotate(0deg)";
  } else {
    // a tiny nudge on load so the cord settles with a small sway
    var t0 = pts[N - 1];
    t0.x = 6;
    t0.px = 6;
    kick();
  }

  window.Badge = { kick: kick, reset: reset };
})();
