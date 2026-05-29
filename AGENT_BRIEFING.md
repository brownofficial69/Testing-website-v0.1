# Portfolio Project — Agent Briefing (Copy/Paste Ready)

## TL;DR
Shadman's cybersecurity portfolio website. v9 is Windows 95 desktop theme. Static site (HTML/CSS/JS), no backend. GitHub Pages auto-deploy. Live: https://brownofficial69.github.io/Testing-website-v0.1/

## Repo Structure
```
portfolio/
├── v9/                 ← LATEST (Windows 95 theme)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── v2-v8/              ← Archived versions
├── README.md           ← Full docs
├── HANDOFF_v9.md       ← Detailed handoff
└── .github/workflows/deploy.yml  ← Auto-deploy
```

## v9 Features (Windows 95 Theme)
- Boot screen animation
- Draggable windows (About, Projects, Skills, Education, Certs, Contact, System Info)
- Desktop icons + taskbar
- GSAP animations on scroll/interactions
- Web Audio API synth (optional, off by default)
- Mobile-responsive
- Respects `prefers-reduced-motion`

## Tech Stack
- **HTML5 + CSS3 + Vanilla JS**
- **GSAP 3.12** for animations
- **HTML5 Canvas** for effects
- **Web Audio API** for sound
- **Google Fonts, Font Awesome 6**
- **No npm/build step** — pure static

## 6 Projects Showcased
1. ThreatWeave (Go + Claude API)
2. SecureView (React + Vite + Claude API)
3. SOC Detection Lab (Python + Sigma)
4. IOC Hunter (Python + VirusTotal)
5. NIST CSF 2.0 Gap Assessment
6. AWS Healthcare AI Triage (case study)

## Deploy
- Push to `main` → GitHub Actions runs → GitHub Pages live in ~60s
- Repo: https://github.com/brownofficial69/Testing-website-v0.1

## Quick Edits
- **Update projects:** Edit `PROJECT_DATA` array in `v9/script.js`
- **Change colors:** CSS vars in `v9/style.css` (search `--`)
- **Add CV:** Drop `assets/cv.pdf` file
- **Update contact:** Search `v9/index.html` for email/links
- **Swap profile photo:** Replace `assets/profile.jpg` (600×800 px JPEG)

## Key Files
| File | Purpose |
|------|---------|
| `v9/index.html` | Windows 95 UI shell, desktop icons, windows |
| `v9/script.js` | Window manager, dragging, animations, modals |
| `v9/style.css` | OS theme styles, responsive layout |
| `README.md` | Full project documentation |
| `HANDOFF_v9.md` | Detailed handoff for agents |

## Version History
- v2: Brown/fire
- v3: Space explorer (3D planets)
- v4: Terminal/hacker
- v5: Glassmorphism
- v6: Brutalist
- v7: Cyberpunk neon
- v8: Synthwave/retrowave
- **v9: Windows 95** ← CURRENT

All versions archived in git; v9 is the live version.

## Testing
```bash
# Local preview
python -m http.server 5500
# Visit http://localhost:5500/v9/
```

Or just open `v9/index.html` directly in a browser.

## Next Steps
1. Clone/navigate to `portfolio/` folder
2. Edit `v9/` files as needed
3. Test locally
4. `git add -A && git commit -m "..."` && `git push origin main`
5. Site auto-deploys in ~60s

---

Built with Claude Code. Contact: brownofficial69@gmail.com
