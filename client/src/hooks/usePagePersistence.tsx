import syncedStore, { getYjsDoc } from "@syncedstore/core";
import { MappedTypeDescription } from "@syncedstore/core/types/doc";
import { useSyncedStore } from "@syncedstore/react";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";

import { Item } from "../utils/types";
import { YPersistence } from "../utils/y-persistence";
import { YServerStore } from "../utils/y-server-store";

export type PagePersistence = {
  data: MappedTypeDescription<{
    content: Item[];
    meta: Record<string, unknown>;
  }> | null;
  local: IndexeddbPersistence | null;
  remote: YPersistence | null;
};

const PAGE_DATA_SHAPE = {
  content: [] as Item[],
  meta: {} as Record<string, unknown>,
};

export function usePagePersistence(pageId: string) {
  const store = syncedStore(PAGE_DATA_SHAPE);
  const data = useSyncedStore(store, [pageId]);
  const doc = getYjsDoc(store);
  const docId = `nta/pages/${pageId}`;

  const [persistence, setPersistence] = useState<PagePersistence>({
    data: null,
    local: null,
    remote: null,
  });

  useEffect(() => {
    const localPersistence = new IndexeddbPersistence(docId, doc);
    localPersistence.whenSynced.then(() => {
      setPersistence({ ...persistence, local: localPersistence, data });
    });

    const remotePersistence = new YPersistence(
      docId,
      doc,
      () => new YServerStore(pageId)
    );
    remotePersistence.whenSynced.then(() => {
      setPersistence({ ...persistence, remote: remotePersistence, data });
    });

    const connectors = [
      remotePersistence,
      localPersistence,
      new WebrtcProvider(docId, doc),
    ];

    return () => {
      connectors.forEach((p) => p.destroy());
    };
  }, [pageId]);

  return persistence;
}
