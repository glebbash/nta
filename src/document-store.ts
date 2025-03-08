import { IDBPDatabase, openDB, DBSchema } from "idb";
import * as Y from "yjs";

const DOC_STATE_STORE = "doc-state";
interface LocalSyncDBSchema extends DBSchema {
  [DOC_STATE_STORE]: {
    key: string;
    value: { updates: Uint8Array[] };
  };
}

export class DocumentStore {
  public static ORIGIN = this;

  public debug = false;

  private constructor(private db: IDBPDatabase<LocalSyncDBSchema>) {}

  static async load(dbName: string) {
    // make sure the browser doesn't clear the storage
    if (navigator.storage && navigator.storage.persist) {
      await navigator.storage.persist();
    }

    const db = await openDB<LocalSyncDBSchema>(dbName, 1, {
      upgrade(db) {
        db.createObjectStore(DOC_STATE_STORE);
      },
    });

    return new DocumentStore(db);
  }

  async track(doc: Y.Doc, docId: string) {
    doc.on("update", async (_update, origin) => {
      if (origin === DocumentStore.ORIGIN) {
        return;
      }

      const beginTime = Date.now();
      const state = Y.encodeStateAsUpdate(doc);
      await this.storeDocumentState(docId, state);

      if (this.debug) {
        console.log(`doc ${docId} stored in ${Date.now() - beginTime}ms`);
      }
    });

    const beginTime = Date.now();
    const state = await this.loadDocumentState(docId);
    if (state !== undefined) {
      Y.applyUpdate(doc, state, DocumentStore.ORIGIN);

      if (this.debug) {
        console.log(`doc ${docId} loaded in ${Date.now() - beginTime}ms`);
      }
    }
  }

  async createDoc(docId: string, doc: Y.Doc) {
    await this.storeDocumentState(docId, Y.encodeStateAsUpdate(doc));
  }

  async deleteDoc(docId: string) {
    await this.db.delete(DOC_STATE_STORE, docId);
  }

  private async storeDocumentState(docId: string, state: Uint8Array) {
    await this.db.put(DOC_STATE_STORE, { updates: [state] }, docId);
  }

  private async loadDocumentState(docId: string) {
    const doc = await this.db.get(DOC_STATE_STORE, docId);
    return doc?.updates[0];
  }
}
