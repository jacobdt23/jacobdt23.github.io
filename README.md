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

## Build

```
hugo --minify
```

Output goes to `public/`.
