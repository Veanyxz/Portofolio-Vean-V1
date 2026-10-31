// public/badge.js
// Hanging ID-badge: pendulum swing from a top anchor, pointer drag,
// press state, and cursor tilt. Green theme, no dependencies.

(function () {
  "use strict";

  var stage = document.getElementById("badge");
  if (!stage) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var ang = 0, vel = 0;              // swing angle (deg) + angular velocity
  var tiltX = 0, tiltY = 0;          // cursor tilt targets
  var cTiltX = 0, cTiltY = 0;        // smoothed
  var press = 0, tPress = 0;
  var dragging = false, sx = 0, sy = 0, baseAng = 0, moved = 0;

  var card = stage.querySelector(".id-card");
  var strap = stage.querySelector(".badge-strap");

  function frame() {
    // pendulum: gravity torque is -sin(angle), damped
    if (!dragging) {
      var torque = -Math.sin(ang * Math.PI / 180) * 1.9;
      vel += torque * 0.048;
      vel *= 0.982;
      ang += vel;
      if (Math.abs(ang) < 0.01 && Math.abs(vel) < 0.01) { ang = 0; vel = 0; }
    }
    cTiltX += (tiltX - cTiltX) * 0.14;
    cTiltY += (tiltY - cTiltY) * 0.14;
    press += (tPress - press) * 0.22;

    stage.style.setProperty("--swing", ang.toFixed(3) + "deg");
    stage.style.setProperty("--rotx", cTiltY.toFixed(2) + "deg");
    stage.style.setProperty("--roty", cTiltX.toFixed(2) + "deg");
    stage.style.setProperty("--press", press.toFixed(3));
    // strap bends slightly against the swing: fake cord flex
    if (strap) strap.style.setProperty("--bend", (ang * -0.18).toFixed(3) + "deg");

    requestAnimationFrame(frame);
  }

  /* ---------- cursor tilt ---------- */
  if (fine && !reduce) {
    stage.addEventListener("pointermove", function (e) {
      if (dragging) return;
      var r = stage.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      tiltX = (px - 0.5) * 2 * 13;
      tiltY = -(py - 0.5) * 2 * 11;
      stage.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      stage.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    });
    stage.addEventListener("pointerleave", function () {
      if (dragging) return;
      tiltX = 0; tiltY = 0;
    });
  }

  /* native HTML5 drag + text selection cancel the pointer stream, so kill both */
  stage.addEventListener("dragstart", function (e) { e.preventDefault(); });
  stage.addEventListener("selectstart", function (e) { e.preventDefault(); });
  card.addEventListener("dragstart", function (e) { e.preventDefault(); });
  stage.querySelectorAll("img").forEach(function (im) {
    im.setAttribute("draggable", "false");
    im.addEventListener("dragstart", function (e) { e.preventDefault(); });
  });

  /* ---------- drag: pull the badge, release => swing ---------- */
  stage.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    dragging = true;
    moved = 0;
    sx = e.clientX;
    sy = e.clientY;
    baseAng = ang;
    tPress = 1;
    card.classList.add("pressed");
    stage.classList.add("grabbing");
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
  });

  stage.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - sx;
    moved = Math.max(moved, Math.abs(dx) + Math.abs(e.clientY - sy));
    var r = stage.getBoundingClientRect();
    var next = baseAng + (dx / Math.max(r.width, 1)) * 62;
    if (next > 34) next = 34;
    if (next < -34) next = -34;
    ang = next;
    vel = 0;
  });

  function release(e) {
    if (!dragging) return;
    dragging = false;
    tPress = 0;
    card.classList.remove("pressed");
    stage.classList.remove("grabbing");
    vel = ang * 0.056;                    // impulse: keeps swinging after release
    if (e && e.pointerId != null) {
      try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
    }
  }
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);

  /* ---------- press in place (no drag) = flip the card ---------- */
  stage.addEventListener("click", function (e) {
    if (moved > 8) return;                // was a drag, not a tap
    card.classList.toggle("flipped");
  });
  stage.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.classList.toggle("flipped");
      vel = 1.6;                          // nudge the swing on keyboard flip
    }
  });

  if (reduce) {
    stage.style.setProperty("--swing", "0deg");
  } else {
    requestAnimationFrame(frame);
  }

  window.Badge = { nudge: function (v) { vel += v; } };
})();
