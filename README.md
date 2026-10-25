# Shadman Hossain: AI Security and Security Engineering Portfolio

Personal portfolio for Shadman Hossain, a First-Class Ethical Hacking and Cyber Security graduate of Coventry University working in AI security and security engineering. It is a fully static site, deployed to GitHub Pages by GitHub Actions on every push to `main`.

**Live site:** https://brownofficial69.github.io/Testing-website-v0.1/

## What is on the site

**Homepage** (`index.html`, `style.css`, `script.js`)
- About, skills, projects, a showreel, experience, education, Claude Academy badges, Pluralsight Skill IQs and courses, and a contact form.
- **Calm design** (`calm.css`, `calm.js`): solid surfaces, hairline borders, one accent colour, Fraunces headings over Inter body text, and short eased motion that confirms an action rather than performing. It replaced the earlier blurred-glass panes. Sound is off until you turn it on.
- **Quiet themes**: **Calm** (warm paper) and **Night** (dark). The site follows your device's light or dark setting until you choose a theme.
- **Quiet motion** (`motion.js`): a slow field of contour lines behind the hero that leans toward the pointer, hero copy that arrives in sequence, cards that enter a beat apart, one nav indicator that glides to the active section, and a timeline rail that grows with scroll. In the quiet themes pages fade into each other instead of wiping. Everything pauses off-screen and stops for reduced-motion users.
- **Command menu**: press Ctrl/⌘ K or / (or the search button) to jump to a section, open a game or demo, copy the email address, download the CV or switch theme.
- **Pick up where you left off**: on a return visit a small chip offers to take you back to the section you last read. Only the section id is stored, in your own browser.
- **Expressive themes** (`fx.js`, `bg.js`): **Aqua** is the one water theme, with flowing currents, drifting colour and ripples that follow touch. **Neural** (tsParticles, MIT), **Orbital** (Vanta.js globe, MIT, over NASA Black Marble imagery, public domain), **Reactor** (Vanta.js rings) and **Hologram** (Vanta.js dots, light) are built on free libraries and load only when chosen. Press T on any page to cycle themes.
- **Showreel** (`showreel.js`): a 37-second cut drawn live on a canvas at native resolution (no video file), with six chapters you can play with: question the agents, drag the threat graph, switch Sigma rules off to see where an intrusion is caught, and tamper with a ledger whose SHA-256 hashes are computed live with the Web Crypto API. A chapter list underneath explains what each one teaches. Keys: Space, arrows, F.
- **Architecture diagrams** (`diagrams.js`): animated SVG for each project, shown in the project panels.
- Transitions: sections fade in once with a small rise, a circular wipe between pages (`site-fx.js`) and cross-document view transitions (`transitions.css`). The droplet intro plays only in Aqua.
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
| `v43` | Prompt Injection Range: defend a simulated AI agent with layered controls and see which attacks still get through |
| `v45` | Break the Login: a SQL injection sandbox, from a raw query to a weak filter to the parameterised fix |
| `v44` | Incident Desk: a 75-second service-desk triage shift using the impact and urgency priority matrix |

`demos/` holds the six project demos linked from the homepage project cards. Each has a "try this" strip and an animated architecture diagram (`demos/extra.js`, `diagrams.js`), plus a guided tour, a three-question quick check with explanations and a glossary (`demos/learn.js`). The supply-chain demo adds a live risk radar with a "biggest single win" hint, and ThreatWeave a correlation graph of networks, indicators and ATT&CK techniques. All of it is plain JavaScript with no libraries.

## Project layout

```
index.html, style.css, script.js   homepage
calm.css, calm.js, motion.js       calm design layer, command menu, welcome back, quiet motion
fx.js, bg.js, site-fx.js, showreel.js, diagrams.js   water engine, theme backgrounds, page effects, reel, diagrams
theme.css, fxpage.css, page-fx.js            theme tokens and the water background for the gallery and games
transitions.css                    shared page transitions
labs.css                           shared styles for the science games
versions.html                      gallery
gallery/                           gallery thumbnails
assets/                            profile photo, favicon, cv.pdf
demos/                             project demos
v19 v27 v28 v32 v36-v37 v41-v45/           interactive pages
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
- Claude Academy: seven completion badges.
- Pluralsight (through FDM): Skill IQ Expert in Microsoft Intune Fundamentals and ServiceNow, plus 20 completed courses. CompTIA Tech+ courses are exam preparation only; the certification is not claimed.

## Deployment

Push to `main`. The workflow in `.github/workflows/deploy.yml` publishes the repository to the `gh-pages` branch, and the site is live within about a minute. In the repository settings, Pages should serve the `gh-pages` branch.

## Updating common things

| Task | Where |
|------|-------|
| Update the CV | Replace `assets/cv.pdf` |
| Change a project | The `PROJECTS` object in `script.js` and the matching card in `index.html` |
| Add a theme | A background in `bg.js` (or add it to `QUIET` for none), a `html[data-theme="..."]` block in `style.css` and `theme.css`, and an entry in `THEMES` in `script.js` (and `IDS` in `page-fx.js`) |
| Update badges or Skill IQs | The `#certifications` and `#pluralsight` sections of `index.html` |

## Credits

tsParticles, Vanta.js and three.js (MIT); NASA Earth Observatory Black Marble night-lights imagery (public domain); fonts from Google Fonts (OFL).

## Accessibility

Visible focus rings on every control, 40–44 px targets for icon buttons, colour contrast checked against WCAG 2.2 AA for the quiet themes, a skip link, and `prefers-reduced-motion` respected throughout (hover lifts, the command menu and section reveals all switch off).

## Third-party code

No library is loaded from a CDN at runtime. The few the site uses are pinned copies in `vendor/`, loaded with Subresource Integrity hashes, all versions published between 2021 and 2024, before the 2026 npm supply-chain compromises:

| Library | Version | Used for |
|---|---|---|
| GSAP + ScrollTrigger | 3.12.5 | section fade-ins on the homepage |
| Font Awesome Free | 6.5.0 | icons |
| three.js | r134 and 0.160.0 | Vanta backgrounds; the 3D pages |
| Vanta.js | 0.5.24 | Orbital, Reactor and Hologram backgrounds |
| tsParticles slim | 2.12.0 | Neural background |

Fonts still come from Google Fonts. The new tours, quizzes, charts, graph and showreel interactions use no third-party code.
