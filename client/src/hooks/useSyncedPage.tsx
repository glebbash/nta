import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";
import { useSyncedStore } from "@syncedstore/react";

import { Page } from "../utils/api";
import { useEffect } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { Item } from "../utils/types";

export function useSyncedPage(page: Page) {
  const store = syncedStore({ content: [] as Item[] });

  useEffect(() => {
    const docId = `nta/pages/${page.id}`;
    const doc = getYjsDoc(store);

    const provider = new WebrtcProvider(docId, doc);
    const localProvider = new IndexeddbPersistence(docId, doc);

    return () => {
      provider.destroy();
      localProvider.destroy();
    };
  }, [page.id]);

  return useSyncedStore(store);
}
