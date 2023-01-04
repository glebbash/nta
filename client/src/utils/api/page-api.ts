import { listFiles, loadFile, saveFile } from "./fs-api";

export type Page = { id: string; meta: Record<string, unknown>; data: string };

export async function listPages(): Promise<Page[]> {
  return Promise.all((await listPageIds()).map(loadPage));
}

export async function listPageIds(): Promise<Page["id"][]> {
  const files = await listFiles("pages");
  const metaFiles = files.filter((f) => f.name.endsWith(".meta.json"));

  return metaFiles.map((mf) =>
    mf.name.slice("pages/".length, -".meta.json".length)
  );
}

export async function listPageMetas(): Promise<Pick<Page, "id" | "meta">[]> {
  return Promise.all(
    (await listPageIds()).map(async (pageId) => {
      return { id: pageId, meta: await loadPageMeta(pageId) };
    })
  );
}

export async function updatePage(page: Page): Promise<void> {
  await Promise.all([
    updatePageData(page.id, page.data),
    saveFile(metaPath(page.id), JSON.stringify(page.meta)),
  ]);
}

export async function loadPage(id: Page["id"]): Promise<Page> {
  const [data, meta] = await Promise.all([loadPageData(id), loadPageMeta(id)]);

  return { id, data, meta };
}

export function updatePageData(id: Page["id"], data: Page["data"]) {
  return saveFile(dataPath(id), JSON.stringify(data));
}

export function updatePageMeta(id: Page["id"], meta: Page["meta"]) {
  return saveFile(metaPath(id), JSON.stringify(meta));
}

export function loadPageData(id: Page["id"]): Promise<Page["data"]> {
  return loadFile(dataPath(id)).then(JSON.parse);
}

export function loadPageMeta(id: Page["id"]): Promise<Page["meta"]> {
  return loadFile(metaPath(id)).then(JSON.parse);
}

function dataPath(id: Page["id"]) {
  return `pages/${id}.json`;
}

function metaPath(id: Page["id"]) {
  return `pages/${id}.meta.json`;
}
