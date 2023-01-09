import { listFiles, loadFile, saveFile } from "./fs-api";

export type Page = {
  id: string;
  data: {
    type: "Page";
    meta: Record<string, unknown>;
    content: Record<string, unknown>[];
    history: string[];
  };
};

export async function listPages(): Promise<Page[]> {
  return Promise.all((await listPageIds()).map(loadPage));
}

export async function listPageIds(): Promise<Page["id"][]> {
  const files = await listFiles("pages");

  return files
    .filter((f) => f.name.endsWith(".json"))
    .map((f) => f.name.slice("pages/".length, -".json".length));
}

export async function loadPage(id: Page["id"]): Promise<Page> {
  return { id, data: await loadFile(pagePath(id)).then(JSON.parse) };
}

export function savePage(page: Page) {
  // TODO: tmp formatting
  return saveFile(pagePath(page.id), JSON.stringify(page.data, null, 2));
}

function pagePath(id: Page["id"]) {
  return `pages/${id}.json`;
}
