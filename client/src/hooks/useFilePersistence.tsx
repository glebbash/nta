import syncedStore, { getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";
import { JsonObject } from "../utils/types";

import { YPersistence } from "../utils/y-persistence";
import { YServerStore } from "../utils/y-server-store";

export type PagePersistence = {
  data: { $: JsonObject } | null;
  local: IndexeddbPersistence | null;
  remote: YPersistence | null;
};

const FILE_DATA_SHAPE = {
  $: {} as JsonObject,
};

export function usePagePersistence(pageId: string): PagePersistence {
  const store = syncedStore(FILE_DATA_SHAPE);

  const doc = getYjsDoc(store);
  const docId = `nta/pages/${pageId}`;

  const data = useSyncedStore(store, [pageId]);
  const [local, setLocal] = useState<PagePersistence["local"]>(null);
  const [remote, setRemote] = useState<PagePersistence["remote"]>(null);

  useEffect(() => {
    const connectors = [] as { destroy(): void }[];

    // TODO: enable
    connectors.push(new WebrtcProvider(docId, doc));

    const localPersistence = new IndexeddbPersistence(docId, doc);
    connectors.push(localPersistence);
    localPersistence.whenSynced.then(() => {
      setLocal(localPersistence);
    });

    const remotePersistence = new YPersistence(
      docId,
      doc,
      () => new YServerStore(pageId)
    );
    connectors.push(remotePersistence);
    remotePersistence.whenSynced.then(() => {
      setRemote(remotePersistence);
    });

    return () => {
      connectors.forEach((p) => p.destroy());
    };
  }, [pageId]);

  return { data: data as never, local, remote };
}
