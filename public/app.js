"use strict";

/* ============================================================
   DATA — EDIT DI SINI
   ============================================================ */

const ROLES = [
  "Full-Stack Developer",
  "Security Researcher",
  "Automation Engineer",
  "System Builder",
];

const PROJECTS = [
  { title: "Vean Uploader", tech: "JavaScript", url: "https://uploader.vean.my.id",
    domain: "uploader.vean.my.id", shot: "shots/uploader.jpg",
    desc: "A no-sign-up file-sharing service for any file type. Drag, drop, or paste and get a shareable link instantly — media stored permanently, everything else on high-speed direct upload.",
    tags: ["file-sharing", "drag & drop", "web tool"] },
  { title: "Vean Shortlink", tech: "JavaScript", url: "https://short.vean.my.id",
    domain: "short.vean.my.id", shot: "shots/shortlink.jpg",
    desc: "A privacy-first URL shortener. Create clean, brandable links with a custom or random slug, permanent or temporary expiry, and no tracking or sign-up.",
    tags: ["url shortener", "privacy", "web tool"] },
  { title: "Audio Tune", tech: "JavaScript · Web Audio", url: "https://audio.vean.my.id",
    domain: "audio.vean.my.id", shot: "shots/audio.jpg",
    desc: "A fully browser-based audio editor — trim, tune speed and pitch, apply effects, and import from YouTube, then export files ready to upload. No install, no server.",
    tags: ["audio editor", "web audio api", "creator tool"] },
  { title: "CodeBin", tech: "JavaScript", url: "https://codebin.vean.my.id/#/",
    domain: "codebin.vean.my.id", shot: "shots/codebin.jpg",
    desc: "A zero-server code snippet sharer. Paste code, pick a language, and get a permanent link with real syntax highlighting. The payload is compressed with DEFLATE and encoded into the URL fragment — nothing is stored, no request ever leaves your machine.",
    tags: ["code sharing", "zero-server", "web tool"] },
  { title: "Ve Retail", tech: "Express · libsql/Turso · Vanilla JS", url: "https://retail.vean.my.id",
    domain: "retail.vean.my.id", shot: "shots/retail.jpg",
    desc: "A full retail point-of-sale and back-office suite for Indonesian shops — touchscreen POS with barcode scan and retail/grosir/reseller pricing, multi-branch inventory, purchase orders and payables, receivables, promotions, vouchers, bundling, cash & bank, double-entry accounting, shift and attendance tracking, plus role-gated access for admin, supervisor, cashier and warehouse.",
    tags: ["pos", "erp", "multi-branch", "accounting"] },
  { title: "DigiPasar", tech: "JavaScript", url: "https://market.vean.my.id",
    domain: "market.vean.my.id", shot: "shots/digipasar.jpg",
    desc: "An Indonesian digital-goods marketplace — game top-ups, pulsa, e-money, streaming vouchers and software licenses, delivered automatically to the buyer's email in under a minute. Full storefront with catalog browsing, search, cart, ID/EN localization, and secure checkout.",
    tags: ["marketplace", "digital goods", "e-commerce"] },
];

const STACK = [
  { name: "Frontend", items: ["JavaScript", "TypeScript", "HTML / CSS", "React", "Next.js", "Tailwind CSS", "Sass", "Vite"] },
  { name: "Backend", items: ["Node.js", "Express", "PHP", "Python", "MySQL", "PostgreSQL", "MongoDB", "Redis"] },
  { name: "Mobile", items: ["Kotlin", "Android", "Jetpack Compose", "Flutter", "Swift", "SwiftUI", "React Native", "Firebase"] },
  { name: "Apps", items: ["Electron", "Tauri", ".NET", "C#", "WPF", "Qt", "PyQt", "pywebview"] },
];

const PROJECTS_VISIBLE = 6;

/* ============================================================
   Environment flags + helpers
   ============================================================ */
const mq = (q) => window.matchMedia(q);
const prefersReduced = mq("(prefers-reduced-motion: reduce)").matches;
const canHover = mq("(hover: hover) and (pointer: fine)").matches;

const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/* One rAF-throttled scroll channel: every scroll consumer subscribes here
   instead of each adding its own listener and forcing its own layout read. */
const scrollSubs = new Set();
let scrollQueued = false;
function onScrollFrame(fn) {
  scrollSubs.add(fn);
  return () => scrollSubs.delete(fn);
}
function runScrollSubs() {
  scrollQueued = false;
  for (const fn of scrollSubs) fn();
}
window.addEventListener("scroll", () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(runScrollSubs);
}, { passive: true });

/* ============================================================
   Boot sequence
   ============================================================ */
const BOOT_LINES = [
  { t: "> booting vean.my.id", cls: "cmd" },
  { t: "> loading modules", cls: "cmd" },
  { t: "  ok", cls: "ok" },
  { t: "> establishing secure channel", cls: "cmd" },
  { t: "  ok", cls: "ok" },
  { t: "> mounting interface", cls: "cmd" },
  { t: "  ok", cls: "ok" },
  { t: "> VEAN ready", cls: "ok" },
];

function runBoot() {
  const linesEl = $("#boot-lines");
  const barEl = $("#boot-bar-fill");
  const statusEl = $("#boot-status");
  if (!linesEl || !barEl || !statusEl) return finishBoot();

  const total = BOOT_LINES.length;
  let i = 0;

  const step = () => {
    if (i >= total) { setTimeout(finishBoot, 240); return; }
    const ln = BOOT_LINES[i];
    const el = document.createElement("div");
    el.className = ln.cls;
    el.textContent = ln.t;
    linesEl.appendChild(el);
    i++;
    const pct = Math.round((i / total) * 100);
    barEl.style.width = pct + "%";
    statusEl.textContent = pct + "%";
    setTimeout(step, prefersReduced ? 30 : 130 + Math.random() * 110);
  };
  step();
}

function finishBoot() {
  const pre = $("#preloader");
  if (pre) pre.classList.add("done");

  $$(".hero-anim").forEach((el, i) => {
    el.style.setProperty("--rv-d", i * 80 + "ms");
    requestAnimationFrame(() => el.classList.add("visible"));
  });
  typeRole();
  observeReveals();
}

/* ============================================================
   Hero role typewriter
   ============================================================ */
function typeRole() {
  const el = $("#type-role");
  if (!el) return;
  if (prefersReduced) { el.textContent = ROLES[0]; return; }

  let ri = 0, ci = 0, deleting = false;
  const tick = () => {
    const word = ROLES[ri];
    ci += deleting ? -1 : 1;
    el.textContent = word.slice(0, ci);
    let delay = deleting ? 34 : 62;
    if (!deleting && ci === word.length) { delay = 1800; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % ROLES.length; delay = 340; }
    // pause the loop while the hero is off-screen
    if (document.hidden) { setTimeout(tick, 400); return; }
    setTimeout(tick, delay);
  };
  tick();
}

/* ============================================================
   Custom cursor (spring trail)
   ============================================================ */
function customCursor() {
  const dot = $("#cursor-dot");
  const ring = $("#cursor-ring");
  if (!dot || !ring) return;
  if (!canHover || prefersReduced) return;

  document.body.classList.add("has-cursor");
  dot.style.opacity = "1";
  ring.style.opacity = "1";

  let mx = -100, my = -100, rx = -100, ry = -100, vx = 0, vy = 0;
  let idle = 0;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    idle = 0;
  }, { passive: true });

  (function loop() {
    vx += (mx - rx) * 0.16;
    vy += (my - ry) * 0.16;
    vx *= 0.78;
    vy *= 0.78;
    rx += vx;
    ry += vy;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    // park the loop once the ring has settled; mousemove wakes it again
    if (Math.abs(vx) + Math.abs(vy) > 0.01 || Math.abs(mx - rx) + Math.abs(my - ry) > 0.1) {
      idle = 0;
      requestAnimationFrame(loop);
    } else if (++idle < 30) {
      requestAnimationFrame(loop);
    } else {
      const wake = () => { idle = 0; requestAnimationFrame(loop); window.removeEventListener("mousemove", wake); };
      window.addEventListener("mousemove", wake, { passive: true, once: true });
    }
  })();

  window.addEventListener("mousedown", () => ring.classList.add("down"));
  window.addEventListener("mouseup", () => ring.classList.remove("down"));

  const hoverables = "a, button, .card, .btn, .compose input, .compose textarea, .gb-field input, .gb-field textarea, [data-modal-close]";
  document.addEventListener("mouseover", (e) => {
    if (!e.target.closest) return;
    ring.classList.toggle("active", !!e.target.closest(hoverables));
  });
}

/* ============================================================
   Scroll progress — scaleX, no layout thrash
   ============================================================ */
function scrollProgress() {
  const bar = $("#scroll-progress");
  if (!bar) return;
  let last = -1;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? clamp(h.scrollTop / max, 0, 1) : 0;
    if (Math.abs(p - last) < 0.0005) return;
    last = p;
    bar.style.transform = `scaleX(${p})`;
  };
  onScrollFrame(update);
  window.addEventListener("resize", update);
  update();
}

/* ============================================================
   Magnetic buttons — offsets live in --tx/--ty so CSS owns transform
   ============================================================ */
function magnetic() {
  if (!canHover || prefersReduced) return;
  $$(".btn").forEach((btn) => {
    if (btn.classList.contains("btn-block")) return;
    let queued = false;
    let tx = 0, ty = 0;

    const apply = () => {
      queued = false;
      btn.style.setProperty("--tx", tx.toFixed(2) + "px");
      btn.style.setProperty("--ty", ty.toFixed(2) + "px");
    };

    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      tx = (e.clientX - r.left - r.width / 2) * 0.14;
      ty = (e.clientY - r.top - r.height / 2) * 0.2;
      if (queued) return;
      queued = true;
      requestAnimationFrame(apply);
    }, { passive: true });

    btn.addEventListener("mouseleave", () => {
      tx = 0; ty = 0;
      if (!queued) { queued = true; requestAnimationFrame(apply); }
    });
  });
}

/* ============================================================
   Nav — scroll state, active section, sliding indicator
   ============================================================ */
function nav() {
  const navEl = $("#nav");
  const links = $$(".nav-link");
  const ind = $("#nav-ind");
  const burger = $("#nav-burger");
  const linksWrap = $("#nav-links");
  const sections = $$("section[id]");
  if (!navEl) return;

  const wide = () => mq("(min-width: 861px)").matches;

  function moveIndicator(active) {
    if (!ind) return;
    if (!wide() || !active) { ind.classList.remove("on"); return; }
    ind.style.left = active.offsetLeft + "px";
    ind.style.width = active.offsetWidth + "px";
    ind.classList.add("on");
  }

  let current = "";
  const onFrame = () => {
    navEl.classList.toggle("scrolled", window.scrollY > 24);
    let active = sections[0] && sections[0].id;
    for (const s of sections) {
      if (window.scrollY >= s.offsetTop - 160) active = s.id;
    }
    if (active === current) return;
    current = active;
    let activeEl = null;
    links.forEach((l) => {
      const on = l.getAttribute("href") === "#" + active;
      l.classList.toggle("active", on);
      if (on) activeEl = l;
    });
    moveIndicator(activeEl);
  };
  onScrollFrame(onFrame);
  window.addEventListener("resize", () => moveIndicator($(".nav-link.active")));
  onFrame();

  if (burger && linksWrap) {
    burger.addEventListener("click", () => {
      const open = linksWrap.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    links.forEach((l) => l.addEventListener("click", () => {
      linksWrap.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }));
    // Escape closes the drawer
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && linksWrap.classList.contains("open")) {
        linksWrap.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.focus();
      }
    });
  }
}

/* ============================================================
   Reveal observer + counters
   ============================================================ */
let revealObserver;

function makeObserver() {
  revealObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      el.classList.add("visible");
      el.querySelectorAll("[data-count]").forEach(countUp);
      revealObserver.unobserve(el);

      // The stagger delay must not outlive the entrance, or every later
      // transition on the same element (hover lift, border) inherits it.
      const delay = parseFloat(getComputedStyle(el).transitionDelay) || 0;
      if (delay > 0) {
        setTimeout(() => el.style.setProperty("--rv-d", "0ms"), delay * 1000 + 800);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
}

function observeReveals() {
  if (!revealObserver) makeObserver();
  $$(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
}

function countUp(el) {
  if (el.dataset.done === "1") return;
  el.dataset.done = "1";
  const target = parseInt(el.dataset.count, 10) || 0;
  if (prefersReduced) { el.textContent = String(target); return; }
  const dur = 1400;
  const t0 = performance.now();
  const frame = (t) => {
    const p = clamp((t - t0) / dur, 0, 1);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* ============================================================
   Showcase
   ============================================================ */
function renderShowcase() {
  const grid = $("#showcase-grid");
  const moreBtn = $("#load-more");
  if (!grid) return;

  let shown = PROJECTS_VISIBLE;

  const render = () => {
    grid.innerHTML = "";
    const frag = document.createDocumentFragment();

    PROJECTS.slice(0, shown).forEach((p, i) => {
      const card = document.createElement("article");
      card.className = "card reveal";
      card.dataset.idx = String(i);
      card.style.setProperty("--rv-d", (i % 3) * 90 + "ms");
      card.innerHTML = `
        <div class="card-preview">
          <div class="preview-bar">
            <span class="pdot r"></span><span class="pdot y"></span><span class="pdot g"></span>
            <span class="preview-url mono">${p.domain}</span>
          </div>
          <div class="preview-shot"><img src="${p.shot}" alt="${p.title} preview" loading="lazy" decoding="async" /></div>
        </div>
        <div class="card-body">
          <div class="card-top">
            <span class="card-tech">${p.tech}</span>
            <span class="card-index">${String(i + 1).padStart(2, "0")}/${PROJECTS.length}</span>
          </div>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          <div class="card-tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          <a class="card-link" href="${p.url}" target="_blank" rel="noopener">
            Visit Project
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>
          </a>
        </div>`;

      if (canHover && !prefersReduced) {
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          const px = clamp((e.clientX - r.left) / r.width, 0, 1);
          const py = clamp((e.clientY - r.top) / r.height, 0, 1);
          card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        }, { passive: true });
      }

      frag.appendChild(card);
    });

    grid.appendChild(frag);

    const remaining = PROJECTS.length - shown;
    if (moreBtn) {
      moreBtn.hidden = remaining <= 0;
      if (remaining > 0) moreBtn.textContent = `Load Additional Projects (${remaining} more)`;
    }
    observeReveals();
  };

  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      shown = Math.min(shown + 6, PROJECTS.length);
      render();
    });
  }
  render();

  const counter = $("#live-projects-count");
  if (counter) counter.setAttribute("data-count", String(PROJECTS.length));
}

/* ============================================================
   Stack
   ============================================================ */
function renderStack() {
  const grid = $("#stack-grid");
  if (!grid) return;
  grid.innerHTML = STACK.map((s, i) => `
    <div class="stack-card reveal" style="--rv-d:${i * 80}ms">
      <h3>${s.name}</h3>
      <ul>${s.items.map((it) => `<li>${it}</li>`).join("")}</ul>
    </div>`).join("");
  observeReveals();
}

/* ============================================================
   Smooth anchor scrolling
   ============================================================ */
function smoothScroll() {
  document.addEventListener("click", (e) => {
    const el = e.target.closest && e.target.closest("[data-scroll]");
    if (!el) return;
    const href = el.getAttribute("href");
    if (!href || href.charAt(0) !== "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      block: "start",
    });
    // keep the URL shareable without adding a history entry per click
    history.replaceState(null, "", href);
    // move keyboard focus with the viewport, or the next Tab jumps back up
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
}

/* ============================================================
   Contact form
   ============================================================ */
function contactForm() {
  const form = $("#compose-form");
  const note = $("#compose-note");
  if (!form || !note) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("#compose-send");
    const orig = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
    note.textContent = "";
    note.style.color = "";

    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) throw new Error("bad status " + res.status);
      note.textContent = "> Message sent — I'll get back to you shortly.";
      form.reset();
    } catch (err) {
      note.style.color = "var(--danger)";
      note.textContent = "> Something went wrong. Please try again, or email me directly at admin@vean.my.id.";
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = orig; }
    }
  });
}

/* ============================================================
   Modal / lightbox — focus trap + restore
   ============================================================ */
let lastFocused = null;

function focusables(root) {
  return $$('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select, [tabindex]:not([tabindex="-1"])', root)
    .filter((el) => el.offsetParent !== null);
}

function openModal(html) {
  const modal = $("#modal");
  const panel = $("#modal-panel");
  if (!modal || !panel) return;

  lastFocused = document.activeElement;
  panel.innerHTML = html;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const close = $(".modal-close", modal);
  if (close) close.focus();

  const ring = $("#cursor-ring");
  if (ring) {
    $$("a, button", panel).forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("active"));
    });
  }
}

function closeModal() {
  const modal = $("#modal");
  if (!modal || !modal.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocused && document.contains(lastFocused)) lastFocused.focus({ preventScroll: true });
  lastFocused = null;
}

function openProjectModal(p) {
  if (!p) return;
  openModal(`
    <div class="modal-project">
      <div class="modal-shot"><img src="${p.shot}" alt="${p.title}" /></div>
      <div class="modal-body">
        <span class="card-tech">${p.tech}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="card-tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
        <div class="modal-actions">
          <a class="btn btn-primary" href="${p.url}" target="_blank" rel="noopener">Visit Project ↗</a>
        </div>
      </div>
    </div>`);
}

function initModal() {
  const modal = $("#modal");
  if (!modal) return;

  $$("[data-modal-close]").forEach((el) => el.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;

    if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }

    if (e.key === "Tab") {
      const list = focusables(modal);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // The hero is a WebGL card: pointer input belongs to card3d (drag/flip),
  // so only Enter opens the lightbox. Space is the flip key, handled there.
  const stage = $("#card3d-stage");
  if (stage) {
    stage.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      openModal(`
        <div class="modal-photo">
          <img src="me.jpg" alt="Vean" />
          <div class="modal-meta">
            <span class="modal-title">Vean</span>
            <span class="mono dim">Full-Stack Developer · Security Researcher</span>
          </div>
        </div>`);
    });
  }

  const grid = $("#showcase-grid");
  if (grid) {
    grid.addEventListener("click", (e) => {
      if (e.target.closest(".card-link")) return;
      const card = e.target.closest(".card");
      if (!card || card.dataset.idx == null) return;
      openProjectModal(PROJECTS[+card.dataset.idx]);
    });
  }
}

/* ============================================================
   Background music
   ============================================================ */
let musicAudio = null;
let musicPlaying = false;

function setRingActive(on) {
  const frame = $(".card3d-stage");
  if (frame) frame.classList.toggle("music-on", on);
}

function initMusic() {
  musicAudio = $("#bg-music");
  const toggle = $("#music-toggle");
  if (!musicAudio || !toggle) return;

  document.body.classList.add("has-music");

  const updateUI = () => {
    toggle.classList.toggle("paused", !musicPlaying);
    toggle.setAttribute("aria-pressed", String(musicPlaying));
  };

  const tryPlay = () => {
    const p = musicAudio.play();
    if (!p || !p.then) { musicPlaying = true; setRingActive(true); updateUI(); return; }
    p.then(() => {
      musicPlaying = true;
      setRingActive(true);
      updateUI();
    }).catch(() => {
      // autoplay blocked: leave the button in the paused state, no console noise
      musicPlaying = false;
      setRingActive(false);
      updateUI();
    });
  };

  tryPlay();

  toggle.addEventListener("click", () => {
    if (!musicPlaying) {
      tryPlay();
    } else {
      musicAudio.pause();
      musicPlaying = false;
      setRingActive(false);
      updateUI();
    }
  });
}

/* ============================================================
   Guestbook — Netlify Function + Blobs
   ============================================================ */
const GB_ENDPOINT = "/.netlify/functions/guestbook";
const GB_VISIBLE = 6;
const GB_MAX_BYTES = 5 * 1024 * 1024; // matches the "max 5MB" label
const gbState = { items: [], shown: GB_VISIBLE, busy: false };

function escHtml(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, (ch) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

function fmtTime(ts) {
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) { const m = Math.floor(diff / 60); return m + (m === 1 ? " minute ago" : " minutes ago"); }
  if (diff < 86400) { const h = Math.floor(diff / 3600); return h + (h === 1 ? " hour ago" : " hours ago"); }
  if (diff < 2592000) { const dd = Math.floor(diff / 86400); return dd + (dd === 1 ? " day ago" : " days ago"); }
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name) {
  const parts = String(name || "?").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const a = parts[0].charAt(0) || "?";
  const b = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (a + b).toUpperCase();
}

function gbNote(msg, kind) {
  const n = $("#gb-note");
  if (!n) return;
  n.textContent = msg || "";
  n.className = "gb-note mono" + (kind ? " " + kind : "");
  if (msg) {
    clearTimeout(gbNote._t);
    gbNote._t = setTimeout(() => { n.textContent = ""; n.className = "gb-note mono"; }, 6000);
  }
}

function gbItemHTML(it) {
  const avatar = it.photo
    ? `<img class="gb-avatar" src="${escHtml(it.photo)}" alt="${escHtml(it.name)}" loading="lazy" />`
    : `<span class="gb-avatar">${escHtml(initials(it.name))}</span>`;
  return `<article class="gb-item">
    ${avatar}
    <div class="gb-main">
      <div class="gb-meta">
        <b class="gb-name">${escHtml(it.name)}</b>
        <time class="gb-time">${escHtml(fmtTime(it.ts))}</time>
      </div>
      <p class="gb-text">${escHtml(it.text)}</p>
    </div>
  </article>`;
}

function gbRender() {
  const list = $("#gb-list");
  const more = $("#gb-more");
  const count = $("#gb-count");
  if (!list) return;

  const items = gbState.items;
  if (count) count.textContent = String(items.length);

  if (!items.length) {
    list.innerHTML = '<p class="gb-empty">No comments yet. Be the first.</p>';
    if (more) more.hidden = true;
    return;
  }

  list.innerHTML = items.slice(0, gbState.shown).map(gbItemHTML).join("");

  if (more) {
    const left = items.length - gbState.shown;
    more.hidden = left <= 0;
    more.textContent = `Load ${Math.min(GB_VISIBLE, Math.max(0, left))} more`;
    more.onclick = () => { gbState.shown += GB_VISIBLE; gbRender(); };
  }
}

function gbSkeleton(n) {
  let out = "";
  for (let i = 0; i < n; i++) {
    out += '<article class="gb-item"><span class="gb-skel" style="width:38px;height:38px;border-radius:50%;flex:none"></span>' +
      '<div class="gb-main"><div class="gb-meta"><b class="gb-name">&nbsp;</b></div>' +
      '<p class="gb-text">&nbsp;</p></div></article>';
  }
  return out;
}

async function gbLoad() {
  const list = $("#gb-list");
  if (!list) return;
  list.innerHTML = gbSkeleton(3);
  try {
    const res = await fetch(GB_ENDPOINT, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    gbState.items = Array.isArray(data.items) ? data.items : [];
    gbState.shown = GB_VISIBLE;
    gbRender();
  } catch (err) {
    list.innerHTML = '<p class="gb-empty">Comments are offline right now. Try again later.</p>';
    console.warn("guestbook:", err.message);
  }
}

/* Shrink a picked photo before it travels: keeps the blob small. */
function compressImage(file, maxSide, quality) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    if (!/^image\//.test(file.type)) return reject(new Error("That file is not an image."));
    if (file.size > GB_MAX_BYTES) return reject(new Error("File is larger than 5MB."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That image looks corrupt."));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
        const cw = Math.max(1, Math.round(img.naturalWidth * scale));
        const ch = Math.max(1, Math.round(img.naturalHeight * scale));
        const cv = document.createElement("canvas");
        cv.width = cw; cv.height = ch;
        cv.getContext("2d").drawImage(img, 0, 0, cw, ch);
        resolve(cv.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function gbPhoto() {
  const input = $("#gb-photo");
  const prev = $("#gb-photo-preview");
  const hint = $("#gb-photo-hint");
  if (!input) return;

  input.addEventListener("change", async () => {
    const f = input.files && input.files[0];
    if (!f) {
      if (prev) { prev.hidden = true; prev.removeAttribute("src"); }
      if (hint) hint.textContent = "max 5MB";
      input.dataset.dataUrl = "";
      return;
    }
    if (hint) hint.textContent = f.name;
    try {
      const dataUrl = await compressImage(f, 240, 0.74);
      input.dataset.dataUrl = dataUrl;
      if (prev) { prev.src = dataUrl; prev.hidden = false; }
    } catch (err) {
      gbNote(err.message, "err");
      input.value = "";
      if (hint) hint.textContent = "max 5MB";
    }
  });
}

function gbForm() {
  const form = $("#gb-form");
  if (!form) return;
  const btn = $("#gb-submit");
  const nameEl = $("#gb-name");
  const textEl = $("#gb-text");
  const photoEl = $("#gb-photo");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (gbState.busy) return;

    const name = (nameEl.value || "").trim();
    const text = (textEl.value || "").trim();
    if (name.length < 2) { gbNote("Name needs at least 2 characters.", "err"); nameEl.focus(); return; }
    if (text.length < 3) { gbNote("Comment needs at least 3 characters.", "err"); textEl.focus(); return; }

    gbState.busy = true;
    const label = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
      const res = await fetch(GB_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, text, photo: (photoEl && photoEl.dataset.dataUrl) || "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "HTTP " + res.status);

      if (data.item) {
        gbState.items.unshift(data.item);
        gbState.shown = Math.max(gbState.shown, GB_VISIBLE);
        gbRender();
      } else {
        gbLoad();
      }

      form.reset();
      const prev = $("#gb-photo-preview");
      if (prev) { prev.hidden = true; prev.removeAttribute("src"); }
      if (photoEl) photoEl.dataset.dataUrl = "";
      const hint = $("#gb-photo-hint");
      if (hint) hint.textContent = "max 5MB";
      gbNote("Posted. Thanks!", "ok");
    } catch (err) {
      gbNote("Failed to post: " + err.message, "err");
    } finally {
      gbState.busy = false;
      btn.disabled = false;
      btn.innerHTML = label;
    }
  });
}

function gbInit() {
  if (!$("#gb-form")) return;
  gbPhoto();
  gbForm();
  gbLoad();
}

/* ============================================================
   Hero parallax — a few px of drift, rAF-driven, desktop only
   ============================================================ */
function heroParallax() {
  if (prefersReduced || !canHover) return;
  const stage = $(".hero-photo");
  if (!stage) return;

  let lastY = -1;
  onScrollFrame(() => {
    const y = window.scrollY;
    if (y > window.innerHeight || Math.abs(y - lastY) < 1) return;
    lastY = y;
    stage.style.setProperty("--py", (y * 0.06).toFixed(2) + "px");
  });
}

/* ============================================================
   Init
   ============================================================ */
function init() {
  makeObserver();
  renderShowcase();
  renderStack();
  customCursor();
  scrollProgress();
  magnetic();
  heroParallax();
  nav();
  smoothScroll();
  contactForm();
  initModal();
  initMusic();
  gbInit();
  runBoot();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
