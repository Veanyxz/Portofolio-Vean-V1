// public/lanyard.js
// Lanyard physics: verlet rope + hanging card, drag and swing back.
// Ported from the 3D_CARD lanyard concept (rope joints + rigid badge),
// reimplemented without WASM so it works as a static self-hosted asset.

(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var N = 6;              // rope points (5 segments)
  var SEG = 9;            // segment length in px -> rope 45px
  var GRAVITY = 0.62;
  var DAMP = 0.965;
  var ITER = 7;
  var ROPE_H = N * SEG;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  function mount(wrap, opts) {
    opts = opts || {};
    var card = wrap.querySelector(".card");
    if (!card) return null;
    if (wrap.dataset.lanyard === "1") return null;   // already mounted
    wrap.dataset.lanyard = "1";

    // idempotent: tilt() runs again after each re-render, never double-mount
    if (wrap.dataset.lanyard === "1" && wrap._lanyard) return wrap._lanyard;

    var body = wrap.querySelector(".hanger-body");
    if (!body) {
      body = document.createElement("div");
      body.className = "hanger-body";
      while (wrap.firstChild) body.appendChild(wrap.firstChild);
      wrap.appendChild(body);
    }

    // rope polyline, drawn behind the card
    var svg = wrap.querySelector(".rope");
    if (!svg) {
      svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "rope");
      svg.setAttribute("aria-hidden", "true");
      var pl = document.createElementNS(NS, "path");
      pl.setAttribute("class", "rope-line");
      svg.appendChild(pl);
      wrap.insertBefore(svg, wrap.firstChild);
    }
    var line = svg.querySelector(".rope-line");

    var W = 0, H = 0;
    var pts = [];
    var restLastX = 0, restLastY = 0;
    var drag = false;
    var targetX = 0, targetY = 0;
    var downX = 0, downY = 0, moved = 0;
    var suppressClick = false;
    var raf = null;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function initPts() {
      W = wrap.clientWidth || 320;
      if (!W) W = 320;
      pts = [];
      for (var i = 0; i < N; i++) {
        var y = i * SEG;
        pts.push({ x: 0, y: y, px: 0, py: y });
      }
      restLastX = 0;
      restLastY = (N - 1) * SEG;
      // card top sits exactly at the last rope point
      wrap.style.setProperty("--rope", ((N - 1) * SEG) + "px");
      svg.setAttribute("viewBox", "0 0 " + W + " " + (ROPE_H + 24));
      svg.setAttribute("width", String(W));
      svg.setAttribute("height", String(ROPE_H + 24));
    }

    function toPath() {
      var ax = W / 2;
      var d = "M " + ax + " 0";
      for (var i = 0; i < N; i++) {
        d += " L " + (ax + pts[i].x).toFixed(2) + " " + pts[i].y.toFixed(2);
      }
      return d;
    }

    function step() {
      // verlet integrate
      for (var i = 1; i < N; i++) {
        var p = pts[i];
        var vx = (p.x - p.px) * DAMP;
        var vy = (p.y - p.py) * DAMP;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;
      }

      // distance constraints (anchor at index 0 is pinned to 0,0)
      for (var k = 0; k < ITER; k++) {
        pts[0].x = 0;
        pts[0].y = 0;
        for (var j = 0; j < N - 1; j++) {
          var a = pts[j], b = pts[j + 1];
          var dx = b.x - a.x, dy = b.y - a.y;
          var d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          var diff = (SEG - d) / d;
          var ox = dx * diff * 0.5, oy = dy * diff * 0.5;
          if (j === 0) {
            b.x += ox * 2; b.y += oy * 2;
          } else {
            a.x -= ox; a.y -= oy;
            b.x += ox; b.y += oy;
          }
        }
        // while dragging, force the tail toward the pointer target
        if (drag) {
          var lp = pts[N - 1];
          lp.x += (targetX - lp.x) * 0.6;
          lp.y += (targetY - lp.y) * 0.6;
        }
      }

      var last = pts[N - 1];
      var prev = pts[N - 2];
      var dxL = last.x - restLastX;
      var dyL = last.y - restLastY;
      var ang = Math.atan2(last.x - prev.x, last.y - prev.y) * 180 / Math.PI;

      line.setAttribute("d", toPath());
      body.style.transform =
        "translate(" + dxL.toFixed(2) + "px," + dyL.toFixed(2) + "px) rotate(" +
        ang.toFixed(3) + "deg)";

      raf = requestAnimationFrame(step);
    }

    function start() {
      if (raf) return;
      if (reduced) {
        line.setAttribute("d", toPath());
        return;
      }
      raf = requestAnimationFrame(step);
    }

    function stop() {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    initPts();
    start();

    window.addEventListener("resize", function () {
      var oldW = W;
      initPts();
      if (oldW && W && oldW !== W) {
        // keep it simple: reset the rope to rest on reflow
        for (var i = 0; i < N; i++) { pts[i].x = 0; pts[i].px = 0; }
      }
    });

    /* ---------- pointer: drag the badge ---------- */
    wrap.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      drag = true;
      moved = 0;
      downX = e.clientX;
      downY = e.clientY;
      var r = wrap.getBoundingClientRect();
      targetX = e.clientX - r.left - r.width / 2;
      targetY = clamp(e.clientY - r.top, 6, ROPE_H + 60);
      card.classList.add("pressed");
      wrap.classList.add("swinging");
      try { wrap.setPointerCapture(e.pointerId); } catch (err) {}
    });

    wrap.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var r = wrap.getBoundingClientRect();
      moved = Math.max(moved, Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY));
      targetX = e.clientX - r.left - r.width / 2;
      targetY = clamp(e.clientY - r.top, 6, ROPE_H + 60);
    });

    function release(e) {
      if (!drag) return;
      drag = false;
      card.classList.remove("pressed");
      window.setTimeout(function () { wrap.classList.remove("swinging"); }, 1400);
      suppressClick = moved > 8;
      if (e && e.pointerId != null) {
        try { wrap.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    }
    wrap.addEventListener("pointerup", release);
    wrap.addEventListener("pointercancel", release);

    // block the click that follows a drag, so dragging never opens the modal
    wrap.addEventListener("click", function (e) {
      if (suppressClick) {
        suppressClick = false;
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if (opts.onClick) {
        e.stopPropagation();
        e.preventDefault();
        opts.onClick();
      }
    }, true);

    var api = { destroy: stop, reset: initPts };
    wrap.dataset.lanyard = "1";
    wrap._lanyard = api;
    return api;
  }

  window.Lanyard = { mount: mount };
})();
