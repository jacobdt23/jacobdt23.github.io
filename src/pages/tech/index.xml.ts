import { getVideos } from "../../lib/site";
import { rssResponse } from "../../lib/rss";

export async function GET() {
  const v = (await getVideos()).filter(
    (x) => x.data.channel === "Jacob Turner - Tech",
  );
  return rssResponse("Tech", "/tech/index.xml", v);
}
