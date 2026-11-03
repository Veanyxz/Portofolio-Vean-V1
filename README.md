# Vean Portfolio

Portofolio pribadi Vean — full-stack developer & security researcher.

Live: https://vean.my.id

## Stack
- Static HTML / CSS / JS, no build step
- Hero ID card rendered in WebGL (three.js r165, vendored at `public/vendor/`)
- Dark terminal/industrial theme, accent `#00ff9c`
- Fonts: Space Grotesk + Inter + JetBrains Mono (Google Fonts)
- Guestbook: Netlify Function + Blobs

## Struktur

```
public/
  index.html            markup
  style.css             seluruh styling; token di :root paling atas
  app.js                data proyek/stack, nav, reveal, modal, guestbook
  card3d.js             kartu ID hero (three.js), spring + drag + flip
  vendor/               three.module.min.js — jangan diedit
  shots/                screenshot 1280x720 per proyek
netlify/functions/
  guestbook.js          GET list, POST append (Netlify Blobs)
```

## Edit konten

Semua data ada di `public/app.js`: `ROLES`, `PROJECTS`, `STACK`.
Tambah proyek = tambah satu blok di `PROJECTS` dan taruh screenshot di `public/shots/`.

## Motion

Semua animasi menghormati `prefers-reduced-motion`. Kartu hero berhenti render
saat keluar layar atau tab disembunyikan; saat diam ia turun ke ~18fps.

Easing family: `--ease` / `--ease-soft` / `--ease-swift`. Durasi: `--dur`,
`--dur-slow`. Jangan bikin kurva baru per komponen.

## Deploy
Netlify — `publish = public`, lihat `netlify.toml`.
