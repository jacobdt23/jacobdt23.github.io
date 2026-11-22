import { getTags } from "../../../lib/site";
import { rssResponse } from "../../../lib/rss";

export async function getStaticPaths() {
  const tags = await getTags();
  return tags.map((tag) => ({ params: { tag: tag.slug }, props: { tag } }));
}

export function GET({ props }: { props: { tag: Awaited<ReturnType<typeof getTags>>[number] } }) {
  const { tag } = props;
  return rssResponse(tag.title, `/tags/${tag.slug}/index.xml`, tag.videos);
}
