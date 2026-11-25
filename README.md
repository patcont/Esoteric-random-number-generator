# 🔮 What is your lucky number today?

A tiny esoteric random number generator: ask the crystal ball and the gods pick your lucky number (0–99)
together with an omen. One of my first JavaScript projects (2022), re-imagined in 2026.

![Screenshot](docs/screenshot.png)

**Live demo:** https://patcont.github.io/Esoteric-random-number-generator

## Features

- Crystal ball that "thinks" (spinning numbers + glow) before revealing the answer
- Random omen with every number; uses `crypto.getRandomValues`
- Optional ambient sound (mystic drone + fire crackles) **synthesized live with the Web Audio API** — no audio files
- Twinkling starfield, responsive layout, *reduced-motion* friendly, keyboard accessible

## Run it

No build step: open `index.html` or serve the folder (`npx serve .`).
(The page uses ES modules, so some browsers need it served over `http://` instead of `file://`.)

## 2026 refresh

The 2022 version used two MP3s ripped from YouTube, GIFs and a downloaded font of unknown license,
and tried to autoplay audio (which modern browsers block). Everything is now drawn with CSS and generated
with the Web Audio API, so the repo went from ~10 MB to a few KB. The original files are in the git history.
