import { Page, PageId, PageInfo, PagePath } from "../models/pages";
import { Ok, Err } from "./responses";

export type ListPagesResult = {
  folders: string[];
  pages: PageInfo[];
};

export type PageNotFound = "PageNotFound";

export const ROOT_PATH: PagePath = [];

export async function listPages(
  path: PagePath = ROOT_PATH
): Promise<Ok<ListPagesResult> | Err<"NonExistingPath">> {
  return {
    ok: true,
    data: {
      folders: [],
      pages: [
        { id: "1", name: "Page 1" },
        { id: "2", name: "Page 2" },
      ],
    },
  };
}

export async function savePage(
  data: Pick<Page, "name" | "path" | "content">
): Promise<Ok<PageId> | Err<"PageAlreadyExists">> {
  return 0 as never;
}

export async function loadPage(
  id: PageId
): Promise<Ok<Page> | Err<PageNotFound>> {
  return {
    ok: true,
    data: {
      id,
      name: `Page #${id}`,
      path: ROOT_PATH,
      meta: {},
      content: "hello",
    },
  };
}
