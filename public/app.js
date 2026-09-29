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
];

const STACK = [
  { name: "Frontend", items: ["JavaScript", "HTML / CSS", "React / Next.js", "Tailwind"] },
  { name: "Backend", items: ["Node.js", "Express", "PHP", "Python"] },
  { name: "Infra", items: ["VPS / Linux", "Docker", "Cloudflare", "Netlify"] },
  { name: "Security", items: ["OSINT", "Recon", "Pentest", "Reverse Engineering"] },
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

  let mx = -100, my = -100, rx = -100, ry = -100;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  const loop = () => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  $$("a, button, .card, .compose input, .compose textarea").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("active"));
    el.addEventListener("mouseleave", () => ring.classList.remove("active"));
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

  // profile photo lightbox
  const photo = $("#photo-frame");
  if (photo) {
    const activate = () => openModal(`
      <div class="modal-photo">
        <img src="https://avatars.githubusercontent.com/u/50613879?v=4" alt="Vean" />
        <div class="modal-meta">
          <span class="modal-title">Vean</span>
          <span class="mono dim">Full-Stack Developer · Security Researcher</span>
        </div>
      </div>`);
    photo.addEventListener("click", activate);
    photo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
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
  runBoot();
}

document.addEventListener("DOMContentLoaded", init);
