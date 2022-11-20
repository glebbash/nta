import { useQuery } from "./use-query";
import { loadPage } from "./api";

export function useLoadPage(pageId: string) {
  const { data, error } = useQuery(`page/${pageId}`, () => loadPage(pageId));

  if (error) {
    return { error, placeholder: <div>failed to load</div> };
  }

  if (!data) {
    return { placeholder: <div>loading...</div> };
  }

  return { data };
}
