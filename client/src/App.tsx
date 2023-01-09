import { useState } from "react";

import { loadPage } from "./utils/api";
import { useQuery } from "./utils/use-query";
import { PageScreen } from "./components/PageScreen";

export function App() {
  const [pageId, setPageId] = useState("page1");

  const { data: page, error } = useQuery(`page/${pageId}`, () =>
    loadPage(pageId)
  );

  if (error) {
    return <div>loading...</div>;
  }

  if (!page) {
    return <div>loading...</div>;
  }

  return <PageScreen {...{ page }} />;
}
