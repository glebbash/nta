import * as Y from "yjs";
import syncedStore, { getYjsDoc } from "@syncedstore/core";
import { useSyncedStore } from "@syncedstore/react";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";

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

export const USER_COLORS = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

const RANDOM_USER_CONFIG = {
  name: "Anonymous " + Math.floor(Math.random() * 100),
  ...USER_COLORS[Math.floor(USER_COLORS.length * Math.random())],
};

export function useFilePersistence(fileId: string): FilePersistence {
  const store = syncedStore(FILE_DATA_SHAPE);

  const doc = getYjsDoc(store);
  const docId = `json-editor/${fileId}`;

  const data = useSyncedStore(store, [fileId]);
  const [filePersistence, setFilePersistence] = useState<FilePersistence>({
    data: data as never,
    undoManager: null,
    local: null,
    syncProvider: null,
  });

  useEffect(() => {
    const localPersistence = new IndexeddbPersistence(docId, doc);
    const syncProvider = new WebrtcProvider(docId, doc, {
      signaling: ["wss://yjs-signaling.deno.dev/"],
    } as never);

    // TODO: check why this works only sometimes
    syncProvider.awareness.setLocalStateField("user", RANDOM_USER_CONFIG);

    localPersistence.whenSynced.then(() => {
      setFilePersistence({
        data: data as never,
        undoManager: new Y.UndoManager(doc.getMap("$")),
        local: localPersistence,
        syncProvider,
      });
    });

    return () => {
      syncProvider.destroy();
      localPersistence.destroy();
    };
  }, [fileId]);

  return filePersistence;
}
