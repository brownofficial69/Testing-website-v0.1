# Shadman Hossain: AI Security and Security Engineering Portfolio

Personal portfolio for Shadman Hossain, a First-Class Ethical Hacking and Cyber Security graduate of Coventry University working in AI security and security engineering. It is a fully static site, deployed to GitHub Pages by GitHub Actions on every push to `main`.

**Live site:** https://brownofficial69.github.io/Testing-website-v0.1/

## What is on the site

**Homepage** (`index.html`, `style.css`, `script.js`)
- About, skills, projects with detail panels, experience, education, Claude Academy badges, Pluralsight Skill IQs and courses, and a contact form.
- Five themes drawn from the CV: Terminal, Kill chain, Mizan, Blueprint and Phosphor. Switch with the palette button or press T.
- Page-to-page transitions (`transitions.css`) for browsers that support cross-document view transitions, with reduced-motion fallbacks.
- CV download from `assets/cv.pdf`.

**Interactive gallery** (`versions.html`)

| Folder | What it is |
|--------|-----------|
| `v42` | ADAM / EVE / Mizan arena: a live agent-authorization simulation with missions, a human approval gate, a red-team mode and a tamper-evident hash-chain ledger |
| `v36` | Threat Graph: the CV as a 3D linked graph (Three.js) |
| `v37` | Intrusion Replay: tune detection rules against a simulated four-stage intrusion |
| `v19` | CyberCity: the projects as a 3D night city (Three.js) |
| `v32` | DNA Helix: projects on one strand, what they demonstrate on the other (Three.js) |
| `v28` | Career Metro: education, security, projects, AI and work as five metro lines |
| `v27` | Periodic Table: pick skills and see which projects they form |
| `v41` | Chess: an engine written from scratch, with move generation checked against standard perft counts |
| `v38` | Cipher Lab: Caesar, substitution, Vigenère and a one-time pad |
| `v39` | Worm Outbreak: an SIR epidemic model on networks with and without hubs |
| `v40` | Collision Lab: hash collisions and the birthday paradox |

`demos/` holds the six small project demos linked from the homepage project cards.

## Project layout

```
index.html, style.css, script.js   homepage
transitions.css                    shared page transitions
labs.css                           shared styles for the science games
versions.html                      gallery
gallery/                           gallery thumbnails
assets/                            profile photo, favicon, cv.pdf
demos/                             project demos
v19 v27 v28 v32 v36-v42/           interactive pages
.github/workflows/deploy.yml       GitHub Pages deployment
```

The 3D pages (`v19`, `v32`, `v36`) load Three.js from jsDelivr and need WebGL. Everything else has no dependencies beyond fonts and icons loaded from a CDN.

## Older designs

Thirty earlier design experiments (`v2` to `v35`) were removed from the live site because they contained claims that are not on the CV. They are preserved in git under the tag `archive-designs-v2-v35`:

```bash
git checkout archive-designs-v2-v35
```

## Content notes

- Degree: First Class Honours, with no percentage shown.
- Claude Academy: seven completion badges, issued 8 September 2026.
- Pluralsight (through FDM): Skill IQ Expert in Microsoft Intune Fundamentals and ServiceNow, plus 20 completed courses. CompTIA Tech+ courses are exam preparation only; the certification is not claimed.

## Deployment

Push to `main`. The workflow in `.github/workflows/deploy.yml` publishes the repository to the `gh-pages` branch, and the site is live within about a minute. In the repository settings, Pages should serve the `gh-pages` branch.

## Updating common things

| Task | Where |
|------|-------|
| Update the CV | Replace `assets/cv.pdf` |
| Change a project | The `PROJECTS` object in `script.js` and the matching card in `index.html` |
| Add a theme | A `html[data-theme="..."]` block at the end of `style.css`, plus an entry in `THEMES` in `script.js` |
| Update badges or Skill IQs | The `#certifications` and `#pluralsight` sections of `index.html` |
