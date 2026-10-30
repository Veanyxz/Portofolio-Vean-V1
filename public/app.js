"use strict";

const ROLES = [
  "Full-Stack Developer",
  "Security Researcher",
  "Automation Engineer",
  "System Builder",
];

const PROJECTS = [
  { title: "Vean Uploader", tech: "JavaScript", url: "https://uploader.vean.my.id",
    domain: "uploader.vean.my.id", shot: "shots/uploader.jpg",
    desc: "A no-sign-up file-sharing service for any file type. Drag, drop, or paste and get a shareable link instantly - media stored permanently, everything else on high-speed direct upload.",
    tags: ["file-sharing", "drag & drop", "web tool"] },
  { title: "Vean Shortlink", tech: "JavaScript", url: "https://short.vean.my.id",
    domain: "short.vean.my.id", shot: "shots/shortlink.jpg",
    desc: "A privacy-first URL shortener. Create clean, brandable links with a custom or random slug, permanent or temporary expiry, and no tracking or sign-up.",
    tags: ["url shortener", "privacy", "web tool"] },
  { title: "Audio Tune", tech: "JavaScript / Web Audio", url: "https://audio.vean.my.id",
    domain: "audio.vean.my.id", shot: "shots/audio.jpg",
    desc: "A fully browser-based audio editor - trim, tune speed and pitch, apply effects, and import from YouTube, then export files ready to upload. No install, no server.",
    tags: ["audio editor", "web audio api", "creator tool"] },
  { title: "CodeBin", tech: "JavaScript", url: "https://codebin.vean.my.id/#/",
    domain: "codebin.vean.my.id", shot: "shots/codebin.jpg",
    desc: "A zero-server code snippet sharer. Paste code, pick a language, and get a permanent link with real syntax highlighting. The payload is compressed with DEFLATE and encoded into the URL fragment - nothing is stored, no request ever leaves your machine.",
    tags: ["code sharing", "zero-server", "web tool"] },
  { title: "Ve Retail", tech: "Express / libsql-Turso / Vanilla JS", url: "https://retail.vean.my.id",
    domain: "retail.vean.my.id", shot: "shots/retail.jpg",
    desc: "A full retail point-of-sale and back-office suite for Indonesian shops - touchscreen POS with barcode scan and retail/grosir/reseller pricing, multi-branch inventory, purchase orders and payables, receivables, promotions, vouchers, bundling, cash and bank, double-entry accounting, shift and attendance tracking, plus role-gated access for admin, supervisor, cashier and warehouse.",
    tags: ["pos", "erp", "multi-branch", "accounting"] },
  { title: "DigiPasar", tech: "JavaScript", url: "https://market.vean.my.id",
    domain: "market.vean.my.id", shot: "shots/digipasar.jpg",
    desc: "An Indonesian digital-goods marketplace - game top-ups, pulsa, e-money, streaming vouchers and software licenses, delivered automatically to the buyer email in under a minute. Full storefront with catalog browsing, search, cart, ID/EN localization, and secure checkout.",
    tags: ["marketplace", "digital goods", "e-commerce"] },
];

function nav() {
  const navEl = $("#nav");
  const burger = $("#nav-burger");
  const linksWrap = $("#nav-links");
  const links = $$(".nav-link");
  const sections = $$("section[id]");
  if (!navEl) return;
  const onScroll = () => {
    navEl.classList.toggle("scrolled", window.scrollY > 24);
    let current = sections[0] && sections[0].id;
    for (const s of sections) {
      if (window.scrollY >= s.offsetTop - 170) current = s.id;
    }
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (burger && linksWrap) {
    burger.addEventListener("click", () => {
      const open = linksWrap.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
    });
    links.forEach((l) => l.addEventListener("click", () => {
      linksWrap.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }));
  }
}

let revealObserver;
function makeObserver() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("visible");
      const num = el.querySelector("[data-count]");
      if (num && !num.dataset.done) { num.dataset.done = "1"; countUp(num); }
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
}
function observeReveals() {
  if (!revealObserver) makeObserver();
  $$(".reveal:not(.visible)").forEach((el) => revealObserver.observe(el));
}
function countUp(el) {
  const target = parseInt(el.dataset.count, 10) || 0;
  const dur = 1300, t0 = performance.now();
  const frame = (t) => {
    const pr = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - pr, 3);
    el.textContent = Math.round(target * eased);
    if (pr < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function tilt() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  $$(".card").forEach((card) => {
    const MAX = 9;
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const ry = (px - 0.5) * 2 * MAX;
      const rx = -(py - 0.5) * 2 * MAX;
      card.classList.add("tilting");
      card.style.setProperty("--rx", rx.toFixed(2) + "deg");
      card.style.setProperty("--ry", ry.toFixed(2) + "deg");
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    };
    const reset = () => {
      card.classList.remove("tilting");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", reset);
  });
}

const STACK = [
  { name: "Frontend", items: ["JavaScript", "TypeScript", "HTML / CSS", "React", "Next.js", "Tailwind", "Sass", "Vite"] },
  { name: "Backend", items: ["Node.js", "Express", "PHP", "Python", "MySQL", "PostgreSQL", "MongoDB", "Redis"] },
  { name: "Mobile", items: ["Kotlin", "Android", "Jetpack Compose", "Flutter", "Swift", "SwiftUI", "React Native", "Firebase"] },
  { name: "Apps", items: ["Electron", "Tauri", ".NET", "C#", "WPF", "Qt", "PyQt", "pywebview"] },
];

const SOCIALS = [
  { name: "GitHub", handle: "@Veanyxz", url: "https://github.com/Veanyxz", icon: "github" },
  { name: "Email", handle: "admin@vean.my.id", url: "mailto:admin@vean.my.id", icon: "mail" },
  { name: "Website", handle: "vean.my.id", url: "https://vean.my.id", icon: "globe" },
];

const LT = String.fromCharCode(60);
const GT = String.fromCharCode(62);

function svg(inner, vb) {
  return LT + 'svg viewBox="' + (vb || '0 0 24 24') + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + GT + inner + LT + '/svg' + GT;
}

const ICONS = {
  github: svg(LT + 'path fill="currentColor" stroke="none" d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5z"' + GT),
  mail: svg(LT + 'rect width="20" height="16" x="2" y="4" rx="2"' + GT + LT + 'path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"' + GT),
  globe: svg(LT + 'circle cx="12" cy="12" r="10"' + GT + LT + 'path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"' + GT),
  arrow: svg(LT + 'path d="M7 17 17 7M9 7h8v8"' + GT),
  send: svg(LT + 'path d="m22 2-7 20-4-9-9-4Z"' + GT + LT + 'path d="M22 2 11 13"' + GT),
  user: svg(LT + 'path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"' + GT + LT + 'circle cx="12" cy="7" r="4"' + GT),
  at: svg(LT + 'circle cx="12" cy="12" r="4"' + GT + LT + 'path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"' + GT),
  chat: svg(LT + 'path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"' + GT),
  image: svg(LT + 'rect width="18" height="18" x="3" y="3" rx="2"' + GT + LT + 'circle cx="9" cy="9" r="2"' + GT + LT + 'path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"' + GT),
};

const GB_ENDPOINT = "/.netlify/functions/guestbook";
const GB_VISIBLE = 6;


function q(sel, root) { return (root || document).querySelector(sel); }
function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
function esc(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, function (ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}

function bootSeq() {
  var linesEl = q("#boot-lines");
  var barEl = q("#boot-bar-fill");
  var statusEl = q("#boot-status");
  var pre = q("#preloader");
  var seq = [
    ["cmd", "> mounting runtime"],
    ["cmd", "> loading modules"],
    ["ok", "  ok"],
    ["cmd", "> secure channel"],
    ["ok", "  ok"],
    ["cmd", "> rendering interface"],
    ["ok", "  ok"],
    ["ok", "> VEAN online"]
  ];
  function finish() {
    if (pre) {
      pre.classList.add("done");
      window.setTimeout(function () { pre.style.display = "none"; }, 780);
    }
    qa(".hero-anim").forEach(function (el, i) {
      el.style.transitionDelay = (i * 90) + "ms";
      requestAnimationFrame(function () { el.classList.add("visible"); });
    });
    typeRole();
    observeReveals();
  }
  if (!linesEl || !barEl) { finish(); return; }
  var i = 0;
  function step() {
    if (i >= seq.length) { window.setTimeout(finish, 200); return; }
    var row = seq[i];
    var d = document.createElement("div");
    d.className = row[0];
    d.textContent = row[1];
    linesEl.appendChild(d);
    i++;
    var pct = Math.round(i / seq.length * 100);
    barEl.style.width = pct + "%";
    if (statusEl) statusEl.textContent = pct + "%";
    window.setTimeout(step, 95 + Math.random() * 80);
  }
  step();
}

function typeRole() {
  var el = q("#type-role");
  if (!el) return;
  var ri = 0, ci = 0, del = false;
  function tick() {
    var w = ROLES[ri];
    ci += del ? -1 : 1;
    el.textContent = w.slice(0, ci);
    var d = del ? 36 : 68;
    if (!del && ci === w.length) { d = 1650; del = true; }
    else if (del && ci === 0) { del = false; ri = (ri + 1) % ROLES.length; d = 300; }
    window.setTimeout(tick, d);
  }
  tick();
}

var shownCount = 0;

function renderShowcase() {
  var wrap = q("#showcase-grid");
  if (!wrap) return;
  var more = q("#load-more");
  var initial = 4;
  var total = PROJECTS.length;
  var show = Math.min(total, initial + shownCount);
  wrap.innerHTML = PROJECTS.slice(0, show).map(cardHTML).join("");
  observeReveals();
  tilt();
  if (more) {
    var left = total - show;
    more.hidden = left <= 0;
    more.textContent = "Lihat " + left + " project lain";
    more.onclick = function () {
      shownCount += 4;
      renderShowcase();
    };
  }
}

function renderStack() {
  var wrap = q("#stack-grid");
  if (!wrap) return;
  wrap.innerHTML = STACK.map(function (g) {
    return '<article class="stack-card glass-card reveal">' +
      '<h3>' + esc(g.name) + '</h3>' +
      '<div class="chip-row">' + g.items.map(function (it) {
        return '<span class="chip">' + esc(it) + '</span>';
      }).join("") + '</div>' +
      '</article>';
  }).join("");
}

function renderSocials() {
  var wrap = q("#socials");
  if (!wrap) return;
  wrap.innerHTML = SOCIALS.map(function (s) {
    return '<a class="social" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
      '<span class="social-ico">' + (ICONS[s.icon] || ICONS.globe) + '</span>' +
      '<span class="social-meta"><b>' + esc(s.name) + '</b><i>' + esc(s.handle) + '</i></span>' +
      '<span class="social-arrow">' + ICONS.arrow + '</span>' +
      '</a>';
  }).join("");
}
function cardHTML(pj, idx) {
  var tags = pj.tags.map(function (t) {
    return '<span class="tag">' + esc(t) + '</span>';
  }).join("");
  var n = String(idx + 1).padStart(2, "0");
  return '<article class="card glass-card reveal" data-idx="' + idx + '">' +
    '<span class="card-glare"></span>' +
    '<div class="card-preview">' +
      '<img src="' + esc(pj.shot) + '" alt="' + esc(pj.title) + ' screenshot" loading="lazy" decoding="async">' +
      '<span class="card-index mono">' + n + '</span>' +
    '</div>' +
    '<div class="card-body">' +
      '<div class="card-top">' +
        '<h3>' + esc(pj.title) + '</h3>' +
        '<span class="card-tech mono">' + esc(pj.tech) + '</span>' +
      '</div>' +
      '<p class="card-desc">' + esc(pj.desc) + '</p>' +
      '<div class="card-tags">' + tags + '</div>' +
      '<div class="card-foot">' +
        '<a class="card-link" href="' + esc(pj.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="mono">' + esc(pj.domain) + '</span>' + ICONS.arrow +
        '</a>' +
      '</div>' +
    '</div>' +
  '</article>';
}
function openModal(pj) {
  var m = q("#modal");
  var panel = q("#modal-panel");
  if (!m || !panel) return;
  var tags = pj.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join("");
  panel.innerHTML = '<button class="modal-close" data-modal-close aria-label="Tutup">&times;</button>' +
    '<div class="modal-shot"><img src="' + esc(pj.shot) + '" alt="' + esc(pj.title) + ' rain"></div>' +
    '<div class="modal-body">' +
      '<p class="mono modal-meta">' + esc(pj.tech) + '</p>' +
      '<h3 class="modal-title">' + esc(pj.title) + '</h3>' +
      '<p class="modal-desc">' + esc(pj.desc) + '</p>' +
      '<div class="card-tags">' + tags + '</div>' +
      '<div class="modal-actions">' +
        '<a class="btn btn-primary" href="' + esc(pj.url) + '" target="_blank" rel="noopener noreferrer">Buka situs ' + ICONS.arrow + '</a>' +
      '</div>' +
    '</div>';
  m.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  var m = q("#modal");
  if (!m) return;
  m.classList.remove("open");
  document.body.style.overflow = "";
}

function modalWiring() {
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest && t.closest("[data-modal-close]")) { closeModal(); return; }
    if (t.id === "modal") { closeModal(); return; }
    var card = t.closest && t.closest(".card");
    if (card && !(t.closest("a"))) {
      var i = parseInt(card.getAttribute("data-idx"), 10);
      if (!isNaN(i) && PROJECTS[i]) openModal(PROJECTS[i]);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
}
function $(sel, root) { return q(sel, root); }
function $$(sel, root) { return qa(sel, root); }

function cursor() {
  var dot = q("#cursor-dot");
  var ring = q("#cursor-ring");
  if (!dot || !ring) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    dot.style.display = "none"; ring.style.display = "none"; return;
  }
  var mx = -100, my = -100, rx = -100, ry = -100, vx = 0, vy = 0;
  window.addEventListener("mousemove", function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
  }, { passive: true });
  function loop() {
    vx = (vx + (mx - rx) * 0.18) * 0.76;
    vy = (vy + (my - ry) * 0.18) * 0.76;
    rx += vx; ry += vy;
    ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
    requestAnimationFrame(loop);
  }
  loop();
  var hov = "a,button,.card,input,textarea,label,.social,.chip";
  document.addEventListener("mouseover", function (e) {
    if (!e.target.closest) return;
    ring.classList.toggle("active", !!e.target.closest(hov));
  });
  window.addEventListener("mousedown", function () { ring.classList.add("down"); });
  window.addEventListener("mouseup", function () { ring.classList.remove("down"); });
}

function progress() {
  var bar = q("#scroll-progress");
  if (!bar) return;
  function upd() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max * 100) : 0) + "%";
  }
  window.addEventListener("scroll", upd, { passive: true });
  window.addEventListener("resize", upd);
  upd();
}

function smoothScroll() {
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href");
    if (!id || id === "#") return;
    var el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
function particles() {
  var cv = q("#particles");
  if (!cv) return;
  var ctx = cv.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0, pts = [];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize() {
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.min(90, Math.max(28, Math.round(W * H / 22000)));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({ x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.5 });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p1 = pts[i];
      p1.x += p1.vx; p1.y += p1.vy;
      if (p1.x < 0 || p1.x > W) p1.vx *= -1;
      if (p1.y < 0 || p1.y > H) p1.vy *= -1;
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.r, 0, 6.2832);
      ctx.fillStyle = "rgba(124,170,255,0.55)";
      ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var p2 = pts[j];
        var dx = p1.x - p2.x, dy = p1.y - p2.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 15000) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = "rgba(124,170,255," + (0.16 * (1 - d2 / 15000)).toFixed(3) + ")";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    if (!reduce) requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener("resize", resize);
  draw();
}
var gbState = { items: [], shown: GB_VISIBLE, busy: false };

function fmtTime(ts) {
  var d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  var diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return Math.floor(diff / 60) + " menit lalu";
  if (diff < 86400) return Math.floor(diff / 3600) + " jam lalu";
  if (diff < 2592000) return Math.floor(diff / 86400) + " hari lalu";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name) {
  var raw = String(name || "?").trim();
  var parts = raw.length ? raw.split(" ") : ["?"];
  var first = parts[0] || "?";
  var last = parts.length > 1 ? parts[parts.length - 1] : "";
  var out = (first.charAt(0) || "?") + (last.charAt(0) || "");
  return out.toUpperCase();
}

function gbItemHTML(it) {
  var avatar = it.photo
    ? '<img class="gb-avatar" src="' + esc(it.photo) + '" alt="' + esc(it.name) + '" loading="lazy">'
    : '<span class="gb-avatar gb-initials">' + esc(initials(it.name)) + '</span>';
  return '<article class="gb-item glass-card">' +
    avatar +
    '<div class="gb-main">' +
      '<div class="gb-meta">' +
        '<b class="gb-name">' + esc(it.name) + '</b>' +
        '<time class="gb-time mono">' + esc(fmtTime(it.ts)) + '</time>' +
      '</div>' +
      '<p class="gb-text">' + esc(it.text) + '</p>' +
    '</div>' +
  '</article>';
}

function gbSkeleton(n) {
  var out = "";
  for (var i = 0; i < n; i++) {
    out += '<article class="gb-item glass-card gb-skel">' +
      '<span class="gb-avatar"></span>' +
      '<div class="gb-main"><div class="gb-meta"><b class="gb-name">&nbsp;</b></div>' +
      '<p class="gb-text">&nbsp;</p></div></article>';
  }
  return out;
}
function gbRender() {
  var list = q("#gb-list");
  var more = q("#gb-more");
  var count = q("#gb-count");
  if (!list) return;
  var items = gbState.items;
  if (count) count.textContent = items.length ? String(items.length) : "0";
  if (!items.length) {
    list.innerHTML = '<p class="gb-empty">Belum ada pesan. Jadi yang pertama.</p>';
    if (more) more.hidden = true;
    return;
  }
  var slice = items.slice(0, gbState.shown);
  list.innerHTML = slice.map(gbItemHTML).join("");
  if (more) {
    more.hidden = gbState.shown >= items.length;
    more.textContent = "Muat " + Math.min(GB_VISIBLE, items.length - gbState.shown) + " pesan lagi";
    more.onclick = function () { gbState.shown += GB_VISIBLE; gbRender(); };
  }
}

function gbNote(msg, kind) {
  var n = q("#gb-note");
  if (!n) return;
  n.textContent = msg || "";
  n.className = "gb-note mono" + (kind ? " " + kind : "");
  if (msg) {
    window.clearTimeout(gbNote._t);
    gbNote._t = window.setTimeout(function () { n.textContent = ""; n.className = "gb-note mono"; }, 6000);
  }
}

function gbLoad() {
  var list = q("#gb-list");
  if (!list) return;
  list.innerHTML = gbSkeleton(3);
  fetch(GB_ENDPOINT, { headers: { Accept: "application/json" } })
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (data) {
      gbState.items = Array.isArray(data.items) ? data.items : [];
      gbState.shown = GB_VISIBLE;
      gbRender();
    })
    .catch(function (err) {
      list.innerHTML = '<p class="gb-empty">Kolom komentar sedang offline. Coba lagi nanti.</p>';
      if (window.console) console.warn("guestbook:", err.message);
    });
}
function compressImage(file, maxSide, quality) {
  return new Promise(function (resolve, reject) {
    if (!file) { resolve(""); return; }
    if (!/^image\//.test(file.type)) { reject(new Error("Bukan file gambar")); return; }
    if (file.size > 8 * 1024 * 1024) { reject(new Error("Maksimal 8 MB")); return; }
    var reader = new FileReader();
    reader.onerror = function () { reject(new Error("Gagal membaca file")); };
    reader.onload = function () {
      var img = new Image();
      img.onerror = function () { reject(new Error("Gambar rusak")); };
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        var scale = Math.min(1, maxSide / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * scale));
        var ch = Math.max(1, Math.round(h * scale));
        var cv = document.createElement("canvas");
        cv.width = cw; cv.height = ch;
        var cx = cv.getContext("2d");
        cx.drawImage(img, 0, 0, cw, ch);
        resolve(cv.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function gbPhoto() {
  var input = q("#gb-photo");
  var prev = q("#gb-photo-preview");
  var hint = q("#gb-photo-hint");
  if (!input) return;
  input.addEventListener("change", function () {
    var f = input.files && input.files[0];
    if (!f) {
      if (prev) { prev.innerHTML = ""; prev.classList.remove("has"); }
      if (hint) hint.textContent = "opsional";
      return;
    }
    if (hint) hint.textContent = f.name;
    compressImage(f, 220, 0.72).then(function (dataUrl) {
      if (!prev) return;
      prev.innerHTML = '<img src="' + dataUrl + '" alt="preview">';
      prev.classList.add("has");
      input.dataset.dataUrl = dataUrl;
    }).catch(function (err) {
      gbNote(err.message, "err");
      input.value = "";
      if (hint) hint.textContent = "opsional";
    });
  });
}
function gbForm() {
  var form = q("#gb-form");
  if (!form) return;
  var btn = q("#gb-submit");
  var nameEl = q("#gb-name");
  var textEl = q("#gb-text");
  var photoEl = q("#gb-photo");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (gbState.busy) return;
    var name = (nameEl && nameEl.value || "").trim();
    var text = (textEl && textEl.value || "").trim();
    if (name.length < 2) { gbNote("Nama minimal 2 karakter.", "err"); if (nameEl) nameEl.focus(); return; }
    if (text.length < 3) { gbNote("Pesan minimal 3 karakter.", "err"); if (textEl) textEl.focus(); return; }
    if (name.length > 40) { gbNote("Nama maksimal 40 karakter.", "err"); return; }
    if (text.length > 600) { gbNote("Pesan maksimal 600 karakter.", "err"); return; }
    gbState.busy = true;
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Mengirim..."; }
    var payload = {
      name: name,
      text: text,
      photo: (photoEl && photoEl.dataset.dataUrl) || ""
    };
    fetch(GB_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) {
          if (!r.ok) throw new Error(j.error || ("HTTP " + r.status));
          return j;
        });
      })
      .then(function (j) {
        if (j && j.item) {
          gbState.items.unshift(j.item);
          gbState.shown = Math.max(gbState.shown, GB_VISIBLE);
          gbRender();
        } else {
          gbLoad();
        }
        form.reset();
        if (photoEl) { delete photoEl.dataset.dataUrl; }
        var prev = q("#gb-photo-preview");
        if (prev) { prev.innerHTML = ""; prev.classList.remove("has"); }
        var hint = q("#gb-photo-hint");
        if (hint) hint.textContent = "opsional";
        gbNote("Pesan terkirim. Makasih!", "ok");
      })
      .catch(function (err) {
        gbNote("Gagal kirim: " + err.message, "err");
      })
      .then(function () {
        gbState.busy = false;
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Kirim"; }
      });
  });
}
function contactForm() {
  var form = q("#contact-form");
  if (!form) return;
  var btn = q("#cf-submit");
  var note = q("#cf-note");
  function say(msg, kind) {
    if (!note) return;
    note.textContent = msg || "";
    note.className = "cf-note mono" + (kind ? " " + kind : "");
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nameEl = q("#cf-name");
    var mailEl = q("#cf-email");
    var msgEl = q("#cf-message");
    var name = (nameEl && nameEl.value || "").trim();
    var mail = (mailEl && mailEl.value || "").trim();
    var body = (msgEl && msgEl.value || "").trim();
    if (!name) { say("Nama masih kosong.", "err"); if (nameEl) nameEl.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { say("Format email belum benar.", "err"); if (mailEl) mailEl.focus(); return; }
    if (body.length < 10) { say("Pesan minimal 10 karakter.", "err"); if (msgEl) msgEl.focus(); return; }
    var fd = new FormData(form);
    fd.set("form-name", "contact");
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Mengirim..."; }
    say("Mengirim...");
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fd).toString()
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        form.reset();
        say("Terkirim. Saya balas secepatnya.", "ok");
      })
      .catch(function (err) { say("Gagal kirim: " + err.message, "err"); })
      .then(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Kirim pesan"; }
      });
  });
}

function musicToggle() {
  var au = q("#bg-music");
  var btn = q("#music-toggle");
  if (!au || !btn) return;
  au.volume = 0;
  var on = false;
  function fade(to, ms) {
    var from = au.volume;
    var t0 = performance.now();
    function step(t) {
      var pr = Math.min((t - t0) / ms, 1);
      au.volume = Math.max(0, Math.min(1, from + (to - from) * pr));
      if (pr < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  btn.addEventListener("click", function () {
    if (on) {
      fade(0, 320);
      window.setTimeout(function () { au.pause(); }, 340);
      btn.classList.remove("playing");
      btn.setAttribute("aria-pressed", "false");
      on = false;
    } else {
      au.play().then(function () {
        fade(0.28, 700);
        btn.classList.add("playing");
        btn.setAttribute("aria-pressed", "true");
        on = true;
      }).catch(function () {
        btn.style.display = "none";
      });
    }
  });
}
function init() {
  renderShowcase();
  renderStack();
  renderSocials();
  makeObserver();
  nav();
  cursor();
  progress();
  smoothScroll();
  particles();
  modalWiring();
  tilt();
  contactForm();
  gbPhoto();
  gbForm();
  gbLoad();
  musicToggle();
  var y = q("#year");
  if (y) y.textContent = String(new Date().getFullYear());
  bootSeq();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}