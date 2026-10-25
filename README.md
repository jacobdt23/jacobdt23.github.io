# YouTube Channels Website

A Hugo site with hand-written HTML templates, light/dark mode, and no theme dependency.

## Setup

```
sudo dnf install hugo
cd ~/projects/youtube-site
hugo server -D
```

Open http://localhost:1313

## Edit

- `hugo.toml`: site title, description, menu
- `data/channels.yaml`: your channels
- `content/videos/`: one markdown file per video (`hugo new videos/my-video.md`)
- `layouts/`: HTML templates
- `assets/css/style.css`: styling

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
hugo --minify
```

Output goes to `public/`.
