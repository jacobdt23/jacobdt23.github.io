import { getVideos } from "../../lib/site";
import { rssResponse } from "../../lib/rss";

export async function GET() {
  return rssResponse("Videos", "/videos/index.xml", await getVideos());
}
