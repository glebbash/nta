import { listFiles, loadFile, saveFile } from "./fs-api";

export type Page = { id: string; data: string };

export async function listPageIds(): Promise<Page["id"][]> {
  const files = await listFiles("pages");
  const metaFiles = files.filter((f) => f.name.endsWith(".meta.json"));

  return metaFiles.map((mf) =>
    mf.name.slice("pages/".length, -".meta.json".length)
  );
}

export async function savePage(page: Page): Promise<void> {
  await saveFile(pagePath(page.id), page.data);
}

export async function loadPage(id: Page["id"]): Promise<Page> {
  const data = await loadFile(pagePath(id));

  return { id, data };
}

function pagePath(id: Page["id"]) {
  return `pages/${id}.md`;
}
