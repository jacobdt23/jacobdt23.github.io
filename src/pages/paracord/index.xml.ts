import { getVideos } from "../../lib/site";
import { rssResponse } from "../../lib/rss";

export async function GET() {
  const v = (await getVideos()).filter(
    (x) => x.data.channel === "Jacob's Paracord Corner",
  );
  return rssResponse("Paracord", "/paracord/index.xml", v);
}
