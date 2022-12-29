import { loadFile, saveFile } from "./fs-api";

export type Page = { id: string; meta: Record<string, unknown>; data: string };

export async function updatePage(page: Page): Promise<void> {
  await Promise.all([
    saveFile(dataPath(page.id), JSON.stringify(page.data)),
    saveFile(metaPath(page.id), JSON.stringify(page.meta)),
  ]);
}

export async function loadPage(id: string): Promise<Page> {
  const [data, meta] = await Promise.all([loadPageData(id), loadPageMeta(id)]);

  return { id, data, meta };
}

export function loadPageData(id: string): Promise<Page["data"]> {
  return loadFile(dataPath(id)).then(JSON.parse);
}

export function loadPageMeta(id: string): Promise<Page["meta"]> {
  return loadFile(metaPath(id)).then(JSON.parse);
}

function dataPath(id: string) {
  return `pages/${id}.json`;
}

function metaPath(id: string) {
  return `pages/${id}.meta.json`;
}
