#!/usr/bin/env python3
"""Add new YouTube videos to the site as Hugo content pages.

Usage:
  scripts/add-videos.py              # find videos on all channels that have no page yet
  scripts/add-videos.py URL [URL..]  # add specific videos by URL or ID
  scripts/add-videos.py --publish    # also git commit and push (deploys the site)
  scripts/add-videos.py --dry-run    # show what would be added, write nothing
"""
import json
import os
import re
import subprocess
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEOS_DIR = os.path.join(ROOT, "content", "videos")

# Keep in sync with data/channels.yaml. `tag` is added to every video from that channel.
CHANNELS = [
    {"handle": "@JacobTurner-p1f9c", "name": "Jacob's Paracord Corner", "tag": "paracord"},
    {"handle": "@jacobturner25", "name": "Jacob Turner - Tech", "tag": "tech"},
]

HDR = {"User-Agent": "Mozilla/5.0", "Cookie": "CONSENT=YES+1", "Accept-Language": "en-US"}


def get(url):
    req = urllib.request.Request(url, headers=HDR)
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "replace")


def walk(o, key, out):
    if isinstance(o, dict):
        if key in o:
            out.append(o[key])
        for x in o.values():
            walk(x, key, out)
    elif isinstance(o, list):
        for x in o:
            walk(x, key, out)


def channel_videos(ch):
    page = get(f"https://www.youtube.com/{ch['handle']}/videos")
    data = json.loads(re.search(r"var ytInitialData = (\{.*?\});</script>", page).group(1))
    items = []
    walk(data, "lockupViewModel", items)
    return [
        (r["contentId"], r["metadata"]["lockupMetadataViewModel"]["title"]["content"].strip(), ch)
        for r in items
        if r.get("contentType") == "LOCKUP_CONTENT_TYPE_VIDEO"
    ]


def video_id(s):
    m = re.search(r"(?:v=|youtu\.be/|shorts/|embed/)([\w-]{11})", s) or re.fullmatch(r"([\w-]{11})", s)
    if not m:
        sys.exit(f"Could not read a video ID from: {s}")
    return m.group(1)


def oembed(vid):
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    d = json.loads(get(url))
    author = d.get("author_url", "").lower()
    ch = next((c for c in CHANNELS if c["handle"].lower() in author), CHANNELS[0])
    return d["title"].strip(), ch


def date_of(vid):
    m = re.search(r'"uploadDate":"([^"]+)"', get(f"https://www.youtube.com/watch?v={vid}"))
    return m.group(1)[:10] if m else None


def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def tags_for(title, ch):
    t = title.lower()
    rules = [("king cobra", "king cobra"), ("cobra", "cobra knot"), ("corba", "cobra knot"),
             ("trilobite", "trilobite"), ("diamond", "diamond knot"), ("core", "cores"),
             ("showcase", "showcase"), ("cuff", "cuffs"), ("how to", "tutorial"),
             ("sanctified", "sanctified"), ("bracelet", "bracelets"),
             ("fedora", "fedora"), ("linux", "linux"), ("windows", "windows"),
             ("nixos", "nixos"), ("arch", "arch linux"), ("ryzen", "hardware"),
             ("rtx", "hardware"), ("gpu", "hardware"), ("stream", "livestream")]
    out = [ch["tag"]]
    for k, tag in rules:
        if k in t and tag not in out:
            out.append(tag)
    return out


def existing_ids():
    ids = set()
    for name in os.listdir(VIDEOS_DIR):
        if name.endswith(".md") and name != "_index.md":
            m = re.search(r'^youtube_id:\s*"?([\w-]{11})"?', open(os.path.join(VIDEOS_DIR, name)).read(), re.M)
            if m:
                ids.add(m.group(1))
    return ids


def write_page(vid, title, ch, date, dry):
    path = os.path.join(VIDEOS_DIR, slug(title) + ".md")
    url = f"https://www.youtube.com/{ch['handle']}"
    body = "\n".join([
        "---",
        f"title: {json.dumps(title)}",
        f"date: {date}",
        f"youtube_id: {json.dumps(vid)}",
        f"channel: {json.dumps(ch['name'])}",
        f"tags: {json.dumps(tags_for(title, ch))}",
        f"summary: {json.dumps(f'{title} - a video from {ch['name']}.')}",
        "---",
        "",
        f"Watch the video above, and [subscribe on YouTube]({url}?sub_confirmation=1) for more.",
        "",
    ])
    print(("[dry-run] would add " if dry else "added ") + os.path.relpath(path, ROOT), f"({date}, {ch['name']})")
    if not dry:
        open(path, "w").write(body)


def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args
    publish = "--publish" in args
    urls = [a for a in args if not a.startswith("--")]

    have = existing_ids()
    if urls:
        todo = []
        for u in urls:
            vid = video_id(u)
            title, ch = oembed(vid)
            todo.append((vid, title, ch))
    else:
        todo = [v for ch in CHANNELS for v in channel_videos(ch)]
    todo = [t for t in todo if t[0] not in have]

    if not todo:
        print("No new videos. The site is up to date.")
        return
    for vid, title, ch in todo:
        write_page(vid, title, ch, date_of(vid), dry)

    if publish and not dry:
        subprocess.run(["git", "-C", ROOT, "add", "-A"], check=True)
        subprocess.run(["git", "-C", ROOT, "commit", "-m", f"Add {len(todo)} new video(s)"], check=True)
        subprocess.run(["git", "-C", ROOT, "push"], check=True)
        print("Pushed. The site redeploys in about a minute.")


if __name__ == "__main__":
    main()
