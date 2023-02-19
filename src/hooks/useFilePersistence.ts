import * as Y from "yjs";
import syncedStore, { getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";
import * as random from "lib0/random";

import { JsonObject } from "../utils/json";

export type FilePersistence = {
  data: { ["~"]: JsonObject };
  undoManager: Y.UndoManager | null;
  local: IndexeddbPersistence | null;
  syncProvider: WebrtcProvider | null;
};

const FILE_DATA_SHAPE = {
  ["~"]: {} as JsonObject,
};

export const usercolors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

// select a random color for this user
export const userColor = usercolors[random.uint32() % usercolors.length];

export function useFilePersistence(fileId: string): FilePersistence {
  const store = syncedStore(FILE_DATA_SHAPE);

  const doc = getYjsDoc(store);
  const docId = `json-editor/${fileId}`;

  const data = useSyncedStore(store, [fileId]);
  const [undoManager, setUndoManager] =
    useState<FilePersistence["undoManager"]>(null);
  const [local, setLocal] = useState<FilePersistence["local"]>(null);
  const [syncProvider, setSyncProvider] =
    useState<FilePersistence["syncProvider"]>(null);

  useEffect(() => {
    const connectors = [] as { destroy(): void }[];

    const syncProvider = new WebrtcProvider(docId, doc);
    connectors.push(syncProvider);

    const localPersistence = new IndexeddbPersistence(docId, doc);
    connectors.push(localPersistence);
    localPersistence.whenSynced.then(() => {
      syncProvider.awareness.setLocalStateField("user", {
        name: "Anonymous " + Math.floor(Math.random() * 100),
        color: userColor.color,
        colorLight: userColor.light,
      });
      setLocal(localPersistence);
      setSyncProvider(syncProvider);
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
    syncProvider,
  };
}
