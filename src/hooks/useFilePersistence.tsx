import * as Y from "yjs";
import syncedStore, { getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";
import { JsonObject } from "../utils/types";

export type PagePersistence = {
  data: { $: JsonObject } | null;
  undoManager: Y.UndoManager | null;
  local: IndexeddbPersistence | null;
};

const FILE_DATA_SHAPE = {
  $: {} as JsonObject,
};

export function usePagePersistence(pageId: string): PagePersistence {
  const store = syncedStore(FILE_DATA_SHAPE);

  const doc = getYjsDoc(store);
  const docId = `json-editor/${pageId}`;

  const data = useSyncedStore(store, [pageId]);
  const [undoManager, setUndoManager] =
    useState<PagePersistence["undoManager"]>(null);
  const [local, setLocal] = useState<PagePersistence["local"]>(null);

  useEffect(() => {
    const connectors = [] as { destroy(): void }[];

    connectors.push(new WebrtcProvider(docId, doc));

    const localPersistence = new IndexeddbPersistence(docId, doc);
    connectors.push(localPersistence);
    localPersistence.whenSynced.then(() => {
      setLocal(localPersistence);
      setUndoManager(new Y.UndoManager(doc.getMap("$")));
    });

    return () => {
      connectors.forEach((p) => p.destroy());
    };
  }, [pageId]);

  return {
    data: data as never,
    undoManager,
    local,
  };
}
