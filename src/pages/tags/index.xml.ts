import { getTags } from "../../lib/site";
import { rssResponse } from "../../lib/rss";
import { getVideos } from "../../lib/site";

export async function GET() {
  return rssResponse("Tags", "/tags/index.xml", await getVideos());
}
