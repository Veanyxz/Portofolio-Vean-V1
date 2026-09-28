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

// Deskripsi seed — refine sesuai project asli kalian.
const PROJECTS = [
  { title: "Vean Uploader", tech: "JavaScript", url: "https://uploader.vean.my.id",
    desc: "Upload file semua tipe — media permanen, non-media via gofile. Drag & drop, dark UI.",
    tags: ["uploader", "file-hosting", "web-tool"] },
  { title: "Scraper", tech: "JavaScript", url: "https://github.com/Veanyxz/Scraper",
    desc: "Scraper web serbaguna buat ambil data dari situs tanpa API.",
    tags: ["scraper", "automation", "node"] },
  { title: "json", tech: "JavaScript", url: "https://github.com/Veanyxz/json",
    desc: "Helper / endpoint JSON buat nge-handle data terstruktur.",
    tags: ["json", "api", "tooling"] },
  { title: "shortlink", tech: "JavaScript", url: "https://github.com/Veanyxz/shortlink",
    desc: "URL shortener ringan — bikin link panjang jadi pendek & rapi.",
    tags: ["url-shortener", "web"] },
  { title: "animestream", tech: "JavaScript", url: "https://github.com/Veanyxz/animestream",
    desc: "Platform streaming anime dengan UI modern dan minim iklan.",
    tags: ["anime", "streaming", "web"] },
  { title: "filezone", tech: "EJS", url: "https://github.com/Veanyxz/filezone",
    desc: "File hosting sederhana — upload & share file lewat browser.",
    tags: ["file-hosting", "node"] },
  { title: "ytdl-downloader", tech: "HTML", url: "https://github.com/Veanyxz/ytdl-downloader",
    desc: "Downloader video YouTube berbasis web.",
    tags: ["youtube", "downloader", "web"] },
  { title: "my-weather-app", tech: "JavaScript", url: "https://github.com/Veanyxz/my-weather-app",
    desc: "Aplikasi cuaca sederhana dengan data real-time.",
    tags: ["weather", "api", "web"] },
  { title: "Speech-to-text", tech: "HTML", url: "https://github.com/Veanyxz/Speech-to-text",
    desc: "Konversi suara ke teks langsung dari browser.",
    tags: ["speech", "stt", "web"] },
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
   Cursor glow
   ============================================================ */
function cursorGlow() {
  const glow = $("#cursor-glow");
  if (!glow || !window.matchMedia("(hover: hover)").matches) return;
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
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
      card.innerHTML = `
        <div class="card-preview">
          <div class="preview-bar">
            <span class="pdot r"></span><span class="pdot y"></span><span class="pdot g"></span>
            <span class="preview-url mono">${p.url.replace(/^https?:\/\//, "")}</span>
          </div>
          <div class="preview-title mono">$ ./${p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</div>
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
            Kunjungi Website
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg>
          </a>
        </div>`;
      grid.appendChild(card);
    });
    moreBtn.hidden = shown >= PROJECTS.length;
    observeReveals();
  };

  moreBtn.addEventListener("click", () => { shown = PROJECTS.length; render(); });
  render();
}

/* ============================================================
   Stack render
   ============================================================ */
function renderStack() {
  const grid = $("#stack-grid");
  if (!grid) return;
  grid.innerHTML = STACK.map((s) => `
    <div class="stack-card reveal">
      <h3>${s.name}</h3>
      <ul>${s.items.map((it) => `<li>${it}</li>`).join("")}</ul>
    </div>`).join("");
  observeReveals();
}

/* ============================================================
   Init
   ============================================================ */
function init() {
  // hide hero behind opaque preloader (avoid flash)
  $$(".hero .eyebrow, .hero-title, .hero-name, .hero-role, .hero-desc, .hero-cta").forEach((el) => el.classList.add("hero-anim"));

  makeObserver();
  renderShowcase();
  renderStack();
  cursorGlow();
  nav();
  runBoot();
}

document.addEventListener("DOMContentLoaded", init);
