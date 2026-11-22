import { getVideos, getTags, permalink, videoUrl, xmlEscape } from "../lib/site";

export async function GET() {
  const videos = await getVideos();
  const tags = await getTags();
  const newest = videos[0]?.data.date.toISOString();
  const entries: [string, string | undefined][] = [
    ["/", newest],
    ["/videos/", newest],
    ["/paracord/", newest],
    ["/tech/", newest],
    ["/calculator/", undefined],
    ["/gear/", undefined],
    ["/about/", undefined],
    ["/where-to-find-me/", undefined],
    ["/tags/", newest],
    ...videos.map((v): [string, string] => [videoUrl(v), v.data.date.toISOString()]),
    ...tags.map((t): [string, string] => [`/tags/${t.slug}/`, t.videos[0].data.date.toISOString()]),
  ];
  const xml =
    `<?xml version="1.0" encoding="utf-8" standalone="yes"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries
      .map(
        ([p, d]) =>
          `<url><loc>${xmlEscape(permalink(p))}</loc>${d ? `<lastmod>${d}</lastmod>` : ""}</url>`,
      )
      .join("") +
    `</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
