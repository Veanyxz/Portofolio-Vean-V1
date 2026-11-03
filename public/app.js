"use strict";

/* ============================================================
   DATA — EDIT DI SINI
   Ganti proyek, deskripsi, stack, role sesuai asli.
   ============================================================ */

const ROLES = [
  "Full-Stack Developer",
  "Security Researcher",
  "Automation Engineer",
  "System Builder",
];

// Proyek showcase — hasil kerjaan asli, bukan repo GitHub.
// Tambah proyek baru: copy satu blok { } di bawah, isi title/url/domain/shot/tech/desc/tags.
// `shot` = path screenshot di public/shots/ (jpg 1280x720).
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
   Helpers
   ============================================================ */
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));

/* ============================================================
   Preloader (boot terminal)
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
  if (!linesEl) return finishBoot();

  const total = BOOT_LINES.length;
  let i = 0;
  const step = () => {
    if (i >= total) { setTimeout(finishBoot, 260); return; }
    const ln = BOOT_LINES[i];
    const el = document.createElement("div");
    el.className = ln.cls;
    el.textContent = ln.t;
    linesEl.appendChild(el);
    i++;
    const pct = Math.round((i / total) * 100);
    barEl.style.width = pct + "%";
    statusEl.textContent = pct + "%";
    setTimeout(step, 150 + Math.random() * 120);
  };
  step();
}

function finishBoot() {
  $("#preloader").classList.add("done");
  // hero entrance (staggered)
  $$(".hero-anim").forEach((el, i) => {
    el.style.transitionDelay = i * 90 + "ms";
    requestAnimationFrame(() => el.classList.add("visible"));
  });
  typeRole();
  observeReveals();
}

/* ============================================================
   Typing role
   ============================================================ */
function typeRole() {
  const el = $("#type-role");
  if (!el) return;
  let ri = 0, ci = 0, deleting = false;
  const tick = () => {
    const word = ROLES[ri];
    ci += deleting ? -1 : 1;
    el.textContent = word.slice(0, ci);
    let delay = deleting ? 38 : 70;
    if (!deleting && ci === word.length) { delay = 1700; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % ROLES.length; delay = 350; }
    setTimeout(tick, delay);
  };
  tick();
}

/* ============================================================
   Custom cursor
   ============================================================ */
function customCursor() {
  const dot = $("#cursor-dot");
  const ring = $("#cursor-ring");
  if (!dot || !ring) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.body.classList.add("has-cursor");
  dot.style.opacity = "1";
  ring.style.opacity = "1";

  let mx = -100, my = -100, rx = -100, ry = -100, vx = 0, vy = 0;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  // spring-physics trailing ring (smoother than linear lerp)
  (function loop() {
    vx += (mx - rx) * 0.16;
    vy += (my - ry) * 0.16;
    vx *= 0.78;
    vy *= 0.78;
    rx += vx;
    ry += vy;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  // click pulse
  window.addEventListener("mousedown", () => ring.classList.add("down"));
  window.addEventListener("mouseup", () => ring.classList.remove("down"));

  // hover grow — delegated, works for dynamic (modal) elements too
  const hoverables = "a, button, .card, .btn, .compose input, .compose textarea, [data-modal-close]";
  document.addEventListener("mouseover", (e) => {
    ring.classList.toggle("active", !!e.target.closest(hoverables));
  });
}

function scrollProgress() {
  const bar = $("#scroll-progress");
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

function magnetic() {
  if (!window.matchMedia("(hover: hover)").matches) return;
  $$(".btn").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ============================================================
   Nav
   ============================================================ */
function nav() {
  const navEl = $("#nav");
  const links = $$(".nav-link");
  const burger = $("#nav-burger");
  const linksWrap = $("#nav-links");
  const sections = $$("section[id]");

  const onScroll = () => {
    navEl.classList.toggle("scrolled", window.scrollY > 24);
    let current = sections[0] && sections[0].id;
    for (const s of sections) {
      if (window.scrollY >= s.offsetTop - 160) current = s.id;
    }
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger.addEventListener("click", () => {
    const open = linksWrap.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  });
  $$(".nav-link").forEach((l) => {
    l.addEventListener("click", () => {
      linksWrap.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============================================================
   Reveal (IntersectionObserver) + counters
   ============================================================ */
let revealObserver;

function makeObserver() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("visible");
      if (el.style.transitionDelay) {
        setTimeout(() => { el.style.transitionDelay = ""; }, 1100);
      }
      const num = el.querySelector("[data-count]");
      if (num) countUp(num);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
}

function observeReveals() {
  $$(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
}

function countUp(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const dur = 1400;
  const t0 = performance.now();
  const frame = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased);
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* ============================================================
   Showcase render
   ============================================================ */
function renderShowcase() {
  const grid = $("#showcase-grid");
  const moreBtn = $("#load-more");
  if (!grid) return;

  let shown = PROJECTS_VISIBLE;
  const render = () => {
    grid.innerHTML = "";
    PROJECTS.slice(0, shown).forEach((p, i) => {
      const card = document.createElement("article");
      card.className = "card reveal";
      card.dataset.idx = i;
      card.style.transitionDelay = (i % 3) * 90 + "ms";
      card.innerHTML = `
        <div class="card-preview">
          <div class="preview-bar">
            <span class="pdot r"></span><span class="pdot y"></span><span class="pdot g"></span>
            <span class="preview-url mono">${p.domain}</span>
          </div>
          <div class="preview-shot"><img src="${p.shot}" alt="${p.title} preview" loading="lazy" /></div>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg>
          </a>
        </div>`;
      grid.appendChild(card);
    });
    const remaining = PROJECTS.length - shown;
    if (remaining > 0) {
      moreBtn.hidden = false;
      moreBtn.textContent = "Load Additional Projects (" + remaining + " more)";
    } else {
      moreBtn.hidden = true;
    }
    observeReveals();
  };

  moreBtn.addEventListener("click", () => { shown = Math.min(shown + 6, PROJECTS.length); render(); });
  render();

  // sync hero counter dengan jumlah project sebenarnya
  const counter = $("#live-projects-count");
  if (counter) counter.setAttribute("data-count", PROJECTS.length);
}

/* ============================================================
   Stack render
   ============================================================ */
function renderStack() {
  const grid = $("#stack-grid");
  if (!grid) return;
  grid.innerHTML = STACK.map((s, i) => `
    <div class="stack-card reveal" style="transition-delay: ${i * 90}ms">
      <h3>${s.name}</h3>
      <ul>${s.items.map((it) => `<li>${it}</li>`).join("")}</ul>
    </div>`).join("");
  observeReveals();
}

/* ============================================================
   Init
   ============================================================ */
function smoothScroll() {
  $$("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });
}

function contactForm() {
  const form = $("#compose-form");
  const note = $("#compose-note");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = $("#compose-send");
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending...";
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
      note.style.color = "#ff7b7b";
      note.textContent = "> Something went wrong. Please try again, or email me directly at admin@vean.my.id.";
    }
    btn.disabled = false;
    btn.textContent = orig;
  });
}

/* ============================================================
   Modal / lightbox
   ============================================================ */
function openModal(html) {
  const modal = $("#modal");
  const panel = $("#modal-panel");
  if (!modal || !panel) return;
  panel.innerHTML = html;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  // cursor ring hover on injected interactive elements
  const ring = $("#cursor-ring");
  if (ring) {
    panel.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("active"));
    });
  }
}

function closeModal() {
  const modal = $("#modal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function openProjectModal(p) {
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
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // profile photo lightbox — the hero is a WebGL card now, so the modal target
  // is the stage itself; card3d.js owns drag/flip on the same element.
  const photo = $("#card3d-stage");
  if (photo) {
    const activate = () => openModal(`
      <div class="modal-photo">
        <img src="me.jpg" alt="Vean" />
        <div class="modal-meta">
          <span class="modal-title">Vean</span>
          <span class="mono dim">Full-Stack Developer · Security Researcher</span>
        </div>
      </div>`);
    // only the keyboard path opens the lightbox; pointer input belongs to the card
    photo.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); activate(); }
    });
  }

  // project card lightbox (delegation)
  const grid = $("#showcase-grid");
  if (grid) {
    grid.addEventListener("click", (e) => {
      if (e.target.closest(".card-link")) return; // let the link open the site
      const card = e.target.closest(".card");
      if (!card || card.dataset.idx == null) return;
      openProjectModal(PROJECTS[+card.dataset.idx]);
    });
  }
}

/* ===== Music toggle + ring loop ===== */
let musicAudio = null;
let musicPlaying = false;

function setRingActive(on) {
  const frame = document.querySelector('.card3d-stage');
  if (frame) frame.classList.toggle('music-on', on);
}

function initMusic() {
  musicAudio = $('#bg-music');
  const toggle = $('#music-toggle');
  if (!musicAudio || !toggle) return;

  document.body.classList.add('has-music');

  function updateUI() {
    toggle.classList.toggle('paused', !musicPlaying);
  }

  function tryPlay() {
    musicAudio.play().then(() => {
      musicPlaying = true;
      setRingActive(true);
      updateUI();
    }).catch((e) => {
      console.warn('Music autoplay failed:', e);
      updateUI();
    });
  }

  tryPlay();

  toggle.addEventListener('click', () => {
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

function init() {
  // hide hero behind opaque preloader (avoid flash)
  $$(".hero .eyebrow, .hero-title, .hero-name, .hero-role, .hero-desc, .hero-cta, .hero-photo").forEach((el) => el.classList.add("hero-anim"));

  makeObserver();
  renderShowcase();
  renderStack();
  customCursor();
  scrollProgress();
  magnetic();
  nav();
  smoothScroll();
  contactForm();
  initModal();
  initMusic();
  gbInit();
  runBoot();
}

/* ============================================================
   Guestbook — Netlify Function + Blobs, no external DB
   ============================================================ */
const GB_ENDPOINT = "/.netlify/functions/guestbook";
const GB_VISIBLE = 6;
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
    // clamp: without this, a short list produced "Load -5 more"
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

/* shrink a picked photo before it travels: keeps the blob small */
function compressImage(file, maxSide, quality) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve("");
    if (!/^image\//.test(file.type)) return reject(new Error("not an image"));
    if (file.size > 8 * 1024 * 1024) return reject(new Error("file is over 8MB"));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("could not read the file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image is corrupt"));
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

document.addEventListener("DOMContentLoaded", init);
