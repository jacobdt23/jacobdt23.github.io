# YouTube Channels Website

An [Astro](https://astro.build) site with hand-written components, light/dark mode, and no theme dependency. (Ported from Hugo; URLs, markup and styling are unchanged.)

## Setup

```bash
npm install
npm run dev      # http://localhost:4321
```

## Edit

- `astro.config.mjs`: site URL and redirects
- `src/lib/site.ts`: site title, description, menu, helpers
- `src/data/channels.yaml`: your channels
- `src/content/videos/`: one markdown file per video
- `src/content/*.md`: About / Where to find me / channel intros
- `src/pages/`, `src/components/`, `src/layouts/`: templates
- `src/styles/style.css`, `src/scripts/main.js`: styling and behaviour

## Add new videos

```
python3 scripts/add-videos.py              # add any channel videos that have no page yet
python3 scripts/add-videos.py URL          # add a specific video
python3 scripts/add-videos.py --publish    # also commit and push (redeploys the site)
python3 scripts/add-videos.py --dry-run    # preview only
```

Live site: https://jacobdt23.github.io/

## Build

```
npm run build
```

Output goes to `dist/`. The GitHub Actions workflow (`.github/workflows/astro.yaml`) builds and deploys it, and checks for new YouTube uploads every 6 hours.
