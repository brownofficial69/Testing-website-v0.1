# Shadman Hossain — Cybersecurity Portfolio

Personal portfolio website for Shadman Hossain, a final-year Ethical Hacking & Cybersecurity student at Coventry University. Built as a fully static site with a cyberpunk/terminal aesthetic, deployed automatically to GitHub Pages.

**Live site:** https://brownofficial69.github.io/Testing-website-v0.1/

---

## Features

- **Full-page matrix rain** — continuous katakana/binary canvas animation behind all content
- **Boot sequence** — simulated terminal boot screen on first visit (sessionStorage flag prevents repeat)
- **Custom cursor** — lerp-following ring with hover expansion and click pulse
- **CRT scanline overlay** — subtle retro phosphor effect across the entire viewport
- **Web Audio API sound engine** — synthesised sounds (no audio files) for navigation, modal open/close, typing, and UI interactions
- **Hero canvas** — hex grid, rotating radar sweep, particle field, data streams, scan line
- **Typing animation** — cycling job titles with cursor blink
- **Project modals** — click any project card to open a detailed overlay with tech stack, MITRE ATT&CK tags, and GitHub links
- **GSAP scroll animations** — staggered reveals for skill cards, project cards, education timeline
- **Animated stat counters** — cubic-ease count-up for GPA, projects, certifications
- **Ambient background text** — randomised code tokens layered behind each section
- **Contact form** — client-side validation with mailto fallback
- **Scroll-to-top button** — appears after 500 px scroll
- **CV download button** — auto-disabled when `assets/cv.pdf` is absent
- **Responsive** — mobile hamburger menu, single-column layouts, touch-safe cursor handling
- **`prefers-reduced-motion`** — disables GSAP animations for accessibility

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, Grid, Flexbox) |
| Scripting | Vanilla JavaScript (ES2020) |
| Animation | GSAP 3.12 + ScrollTrigger |
| Canvas | HTML5 Canvas API (matrix, hero layers) |
| Audio | Web Audio API (synthesised, zero dependencies) |
| Fonts | JetBrains Mono, Space Grotesk (Google Fonts) |
| Icons | Font Awesome 6 Free |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Project Structure

```
Testing-website-v0.1/
├── index.html          # Full single-page portfolio
├── style.css           # Design tokens + all component styles
├── script.js           # All JavaScript (~1600 lines, 60+ functions)
├── assets/
│   ├── profile.jpg     # Profile photo (600×800 progressive JPEG)
│   ├── about-bg.jpg    # About section background texture photo
│   ├── favicon.svg     # SH monogram favicon (green on navy)
│   └── cv.pdf          # ← ADD THIS to enable the Download CV button
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions Pages deployment
```

---

## Projects Showcased

| Project | Stack | Description |
|---------|-------|-------------|
| **ThreatWeave** | Go, Claude AI API | AI-powered threat intel correlation engine — clusters IOCs by ASN/temporal/MITRE, generates CTI narratives |
| **SecureView** | TypeScript, React, Vite, Claude AI API | SOC analyst dashboard — live alert queue, AI triage with MITRE mapping, incident report generation |
| **SOC Detection Lab** | Python, Sigma YAML, MITRE ATT&CK, Wazuh | Detection engineering lab — 4-stage intrusion simulation, Wazuh-compatible rules, pytest suite |
| **IOC Hunter** | Python, ThreatFox, AbuseIPDB, VirusTotal | CLI IOC aggregator — parallel multi-source lookups, 19 tests, CI/SOAR-compatible |
| **NIST CSF 2.0 Gap Assessment** | Markdown, SVG | Full GRC assessment for fictional NHS supplier — maturity scores, 12-month roadmap |
| **AWS Healthcare AI Triage** | Case Study | Threat modelling identified GDPR Art.9 violations leading to strategic project cancellation (2022, Team Lead) |

---

## Deployment

Push to `main` → GitHub Actions runs automatically → site is live within ~60 seconds.

**Initial setup (one-time):**
1. Go to **Settings → Pages** in the repository
2. Set Source to **GitHub Actions**
3. Save — the next push to `main` will deploy

The workflow file is at `.github/workflows/deploy.yml`.

---

## Customisation

| Task | Where |
|------|-------|
| Add CV | Drop `assets/cv.pdf` into the assets folder |
| Update LinkedIn URL | Search `index.html` for `linkedin.com/in/shadman-hossain1206` |
| Swap profile photo | Replace `assets/profile.jpg` (recommended: 600×800 px) |
| Add Live Demo link | Set `liveUrl` in the `PROJECT_DATA` array in `script.js` |
| Disable boot screen | Remove `initBootSequence()` call at bottom of `script.js` |
| Disable sound | Sound is off by default; toggle via the speaker icon in the navbar |

---

## Built With

[Claude Code](https://claude.ai/code) — Anthropic's AI coding assistant, used to design, build, and iterate the entire site across multiple sessions.
