import { SITE, getVideos, getTags, videoUrl, permalink, xmlEscape, type Video } from "./site";

function item(v: Video): string {
  const link = permalink(videoUrl(v));
  return (
    `<item><title>${xmlEscape(v.data.title)}</title><link>${link}</link>` +
    `<pubDate>${v.data.date.toUTCString()}</pubDate><guid>${link}</guid>` +
    `<description>${xmlEscape(v.data.summary ?? "")}</description></item>`
  );
}

export function rssResponse(label: string, path: string, videos: Video[]): Response {
  const link = permalink(path.replace(/index\.xml$/, ""));
  const last = videos[0]?.data.date.toUTCString() ?? new Date().toUTCString();
  const xml =
    `<?xml version="1.0" encoding="utf-8" standalone="yes"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>` +
    `<title>${xmlEscape(`${label} on ${SITE.title}`)}</title><link>${link}</link>` +
    `<description>${xmlEscape(`Recent content in ${label} on ${SITE.title}`)}</description>` +
    `<language>${SITE.locale}</language><lastBuildDate>${last}</lastBuildDate>` +
    `<atom:link href="${permalink(path)}" rel="self" type="application/rss+xml"/>` +
    videos.map(item).join("") +
    `</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

export { getVideos, getTags };
