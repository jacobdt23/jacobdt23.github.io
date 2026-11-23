import { getCollection, type CollectionEntry } from "astro:content";

export const SITE = {
  title: "Jacob Turner",
  description:
    "Paracord tutorials and tech videos: Linux, Windows and PC hardware. Two YouTube channels, one place.",
  author: "Jacob Turner",
  url: "https://jacobdt23-github-io.turnejac01.workers.dev",
  locale: "en-us",
};

export const MENU = [
  { name: "Home", href: "/" },
  { name: "Videos", href: "/videos/" },
  { name: "Paracord", href: "/paracord/" },
  { name: "Tech", href: "/tech/" },
  { name: "Calculator", href: "/calculator/" },
  { name: "Gear", href: "/gear/" },
  { name: "About", href: "/about/" },
  { name: "Where to find me", href: "/where-to-find-me/" },
];

export type Video = CollectionEntry<"videos">;

/** Absolute URL for a site path, e.g. "/videos/" */
export function permalink(path: string): string {
  return new URL(path, SITE.url).toString();
}

/** All published videos, newest first (ties broken by file name). */
export async function getVideos(): Promise<Video[]> {
  const all = await getCollection("videos", ({ data }) => !data.draft);
  return all.sort((a, b) => {
    const d = b.data.date.valueOf() - a.data.date.valueOf();
    return d !== 0 ? d : b.id.localeCompare(a.id);
  });
}

export async function getChannels() {
  const all = await getCollection("channels");
  return all.map((c) => c.data);
}

export const videoUrl = (v: Video) => `/videos/${v.id}/`;

const SHORT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const LONG = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
/** "Jan 2, 2006" */
export const formatShort = (d: Date) => SHORT.format(d);
/** "January 2, 2006" */
export const formatLong = (d: Date) => LONG.format(d);

/** URL-safe slug for tags (lowercase, spaces to dashes). */
export function urlize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-_.~]/gu, "");
}

/** Tag display title ("cobra knot" -> "Cobra Knot"). */
export function termTitle(s: string): string {
  return s.replace(/(^|\s)(\S)/g, (_m, sp, ch) => sp + ch.toUpperCase());
}

export interface Tag {
  slug: string;
  key: string;
  title: string;
  videos: Video[];
}

/** Tags across all videos, alphabetical, each with its videos (newest first). */
export async function getTags(): Promise<Tag[]> {
  const videos = await getVideos();
  const map = new Map<string, Tag>();
  for (const v of videos) {
    for (const t of v.data.tags) {
      const slug = urlize(t);
      let tag = map.get(slug);
      if (!tag) {
        tag = { slug, key: t.toLowerCase(), title: termTitle(t), videos: [] };
        map.set(slug, tag);
      }
      tag.videos.push(v);
    }
  }
  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

/** Minimal XML escaping for RSS/sitemap output. */
export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
