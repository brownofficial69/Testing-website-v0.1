# Shadman's Portfolio — v9 Handoff (ShadmanOS 95)

**Project:** Cybersecurity portfolio website for Shadman Hossain (final-year Ethical Hacking & Cybersecurity student at Coventry University)  
**Latest version:** v9 (ShadmanOS 95 — Windows 95 desktop theme)  
**Status:** Shipped & live at https://brownofficial69.github.io/Testing-website-v0.1/  
**Maintained by:** Shadman Hossain (brownofficial69@gmail.com)

---

## Quick Facts

- **Single-page static site** — no backend, fully static HTML/CSS/JS
- **Fully automated CI/CD** — GitHub Actions → GitHub Pages (every push to `main` deploys in ~60s)
- **Canvas-heavy** — matrix rain, particle effects, animated hero background, audio synthesis
- **Accessibility-aware** — respects `prefers-reduced-motion`, responsive mobile layout, semantic HTML
- **Zero external dependencies** — GSAP for animation, Font Awesome icons, Google Fonts (all via CDN)

---

## Version Evolution (v2 → v9)

| Version | Theme | Key Features | Status |
|---------|-------|--------------|--------|
| **v2** | Brown/fire mode | Different layout, original cyberpunk feel | Archived |
| **v3** | Space explorer | Realistic 4K space, 3D planets, warp animation, parallax | Archived |
| **v4** | Interactive terminal | Hacker mode, terminal aesthetic | Archived |
| **v5** | Glassmorphism | Aurora blob background, glassmorphic cards | Archived |
| **v6** | Brutalist | Minimalist, typography-forward | Archived |
| **v7** | Cyberpunk neon | Neon glows, darker palette | Archived |
| **v8** | Synthwave/retrowave | 80s/90s synth aesthetic, sunset gradients | Archived |
| **v9** | Windows 95 | Desktop OS theme (ShadmanOS 95), draggable windows, taskbar, boot screen | **CURRENT** |

All versions are preserved in git history; each version lives in its own `v{N}/` folder with independent HTML/CSS/JS.

---

## Current Architecture (v9)

```
portfolio/
├── v9/                    # Latest version (Windows 95 theme)
│   ├── index.html         # Windows 95 OS UI shell, desktop icons, window system
│   ├── style.css          # OS-themed styles: windows, taskbar, icons, fonts
│   └── script.js          # Window manager, drag/drop, project modals, animations
├── v8/, v7/, v6/, ...     # Previous versions (read-only archive)
├── README.md              # Main project documentation
├── HANDOFF_v9.md          # This file
├── assets/                # Shared resources (if any)
│   ├── cv.pdf             # Resume/CV download (add to enable button)
│   ├── profile.jpg        # Profile photo (600×800 px JPEG)
│   └── favicon.svg        # SH monogram favicon
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Actions → GitHub Pages (automated)
```

### v9 Feature Set

- **Boot sequence** — animated Windows 95 startup screen + bar (sessionStorage prevents repeat)
- **Desktop UI** — draggable windows, minimize/maximize buttons, taskbar with clock
- **Window system** — About, Projects, Skills, Education, Certifications, Contact, System Info
- **Project modals** — Tech stack, MITRE ATT&CK tags, GitHub links, live demo buttons
- **Animations** — GSAP scroll reveals, window transitions, fade-ins on window open
- **Sound** — Optional Web Audio API synth (speaker icon in taskbar toggles, off by default)
- **Responsive** — Single-column mobile layout, touch-safe interactions
- **Accessibility** — respects `prefers-reduced-motion`, semantic HTML, ARIA labels

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Markup** | HTML5 |
| **Styling** | CSS3 (custom properties, Grid, Flexbox) |
| **Animation** | GSAP 3.12 + ScrollTrigger |
| **Canvas** | HTML5 Canvas API (particle effects, visualizations) |
| **Audio** | Web Audio API (synthesised, zero files) |
| **Fonts** | JetBrains Mono, Space Grotesk (Google Fonts) |
| **Icons** | Font Awesome 6 Free + emoji |
| **CI/CD** | GitHub Actions → GitHub Pages |

---

## Projects Showcased

The portfolio displays 6 major cybersecurity projects:

1. **ThreatWeave** — Go + Claude AI API | Threat intel correlation engine
2. **SecureView** — TypeScript + React + Vite + Claude API | SOC dashboard
3. **SOC Detection Lab** — Python + Sigma YAML + MITRE | Detection engineering
4. **IOC Hunter** — Python + ThreatFox + VirusTotal | CLI IOC aggregator
5. **NIST CSF 2.0 Gap Assessment** — Markdown + SVG | GRC assessment
6. **AWS Healthcare AI Triage** — Case study | Threat modelling (cancelled due to GDPR)

Each project lives in `script.js` as the `PROJECT_DATA` array. Clicking a project card opens a modal with full details.

---

## Customisation Guide

| Task | How |
|------|-----|
| **Add CV** | Drop `assets/cv.pdf` file → CV download button auto-enables |
| **Update contact** | Search `index.html` for email/LinkedIn/GitHub links |
| **Swap profile photo** | Replace `assets/profile.jpg` (recommended: 600×800 px) |
| **Change project list** | Edit `PROJECT_DATA` array in `script.js` |
| **Add project demo link** | Set `liveUrl` property in `PROJECT_DATA[i]` |
| **Disable boot screen** | Remove `initBootSequence()` call at bottom of `script.js` |
| **Disable sound** | Remove audio-related functions in `script.js` (or leave on; default is off) |
| **Change theme colors** | Edit CSS custom properties in `style.css` (e.g., `--primary`, `--accent`) |

---

## Deployment

### Current Setup
- **Repository:** https://github.com/brownofficial69/Testing-website-v0.1
- **Live site:** https://brownofficial69.github.io/Testing-website-v0.1/
- **Branch:** `main` (pushes trigger auto-deploy via GitHub Actions)

### One-time Setup (if needed)
1. Go to repo **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Next push to `main` will deploy automatically

### Workflow
Every push to `main` → GitHub Actions runs `.github/workflows/deploy.yml` → artifacts deployed to GitHub Pages within ~60 seconds.

---

## Git History

Recent commits show iterative version design:

```
e9bfb21 Add v9: ShadmanOS 95 — Windows 95 desktop portfolio
6da53d2 Add v8: synthwave / retrowave portfolio
44cc278 Add v6 (brutalist) and v7 (cyberpunk neon)
90e0c11 Add v5: glassmorphism portfolio with aurora blob background
973f9b2 Add v4: interactive terminal/hacker mode portfolio
e87b17f v3 polish: Milky Way band, scroll zoom, corona rays, shooting stars
...
```

Each version was developed in its own branch and merged to `main`, preserving the full history.

---

## Known Issues & TODOs

- None currently tracked — v9 is stable
- If deploying with older browser support needed, may need GSAP polyfills
- CV button gracefully disables if `assets/cv.pdf` is absent (no error)

---

## Next Steps for Next Agent

If continuing development:

1. **Local testing:** Open `v9/index.html` in a browser (or run `python -m http.server 5500` → `http://localhost:5500/v9/`)
2. **Edit content:** Modify project data in `script.js` or text in `index.html`
3. **Style tweaks:** Edit `style.css` (CSS custom properties are at the top)
4. **Test animations:** Check that GSAP animations work and `prefers-reduced-motion` is respected
5. **Commit & push:** `git add`, `git commit`, `git push origin main` → auto-deploys in ~60s
6. **Verify live site:** Check https://brownofficial69.github.io/Testing-website-v0.1/ after deploy

### Common Edits
- **Add/remove projects:** Modify `PROJECT_DATA` in `script.js`
- **Update skills section:** Search for skill card HTML in `index.html` or edit via window content in `script.js`
- **Change colors:** Edit CSS variables in `style.css` (search for `--`)
- **Add social links:** Search `index.html` for `contact-links` section

---

## Built With

[Claude Code](https://claude.ai/code) — Anthropic's AI coding assistant (used across all versions for design, build, and iteration)

---

**Last updated:** 2026-05-29  
**Version:** 9 (ShadmanOS 95)  
**Deployed:** Live at GitHub Pages
