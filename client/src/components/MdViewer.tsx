import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";

import { useQuery } from "../utils/use-query";

export type MdViewerProps = {
  value: string;
};

export function MdViewer({ value }: MdViewerProps) {
  const { data, error } = useQuery(value, () => parseMd(value));

  if (error) {
    return <p>Error: {"" + error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{ padding: "8px" }}
      dangerouslySetInnerHTML={{ __html: data }}
    ></div>
  );
}

async function parseMd(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);

  return file.toString();
}
