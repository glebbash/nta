import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";
import { useSyncedStore } from "@syncedstore/react";

import { Page } from "../utils/api";
import { useEffect, useRef } from "react";
import { Item } from "../utils/types";
import { YPersistence } from "../utils/y-persistence";
import { YServerStore } from "../utils/y-server-store";

export function useSyncedPage(page: Page) {
  const persistence = useRef<YPersistence>(null);
  const store = syncedStore({ content: [] as Item[] });

  useEffect(() => {
    const docId = `nta/pages/${page.id}`;
    const doc = getYjsDoc(store);

    const serverPersistence = new YPersistence(
      docId,
      doc,
      () => new YServerStore(page)
    );
    const providers = [
      // TODO: check if indexdb has any value
      // new IndexeddbPersistence(docId, doc),
      serverPersistence,
      new WebrtcProvider(docId, doc),
    ];

    (persistence.current as YPersistence) = serverPersistence;

    return () => {
      providers.forEach((p) => p.destroy());
    };
  }, [page.id]);

  return [useSyncedStore(store), persistence] as const;
}
