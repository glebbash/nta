import * as Y from "yjs";
import syncedStore, { getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";
import { JsonObject } from "../utils/types";

export type FilePersistence = {
  data: { $: JsonObject };
  undoManager: Y.UndoManager | null;
  local: IndexeddbPersistence | null;
};

const FILE_DATA_SHAPE = {
  $: {} as JsonObject,
};

export function useFilePersistence(fileId: string): FilePersistence {
  const store = syncedStore(FILE_DATA_SHAPE);

  const doc = getYjsDoc(store);
  const docId = `json-editor/${fileId}`;

  const data = useSyncedStore(store, [fileId]);
  const [undoManager, setUndoManager] =
    useState<FilePersistence["undoManager"]>(null);
  const [local, setLocal] = useState<FilePersistence["local"]>(null);

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
  }, [fileId]);

  return {
    data: data as never,
    undoManager,
    local,
  };
}
