import { PageData } from "../hooks/usePagePersistence";

export function getPageTitle(meta: PageData["meta"]) {
  if (typeof meta.title !== "string") {
    return "New Page";
  }

  return meta.title;
}
