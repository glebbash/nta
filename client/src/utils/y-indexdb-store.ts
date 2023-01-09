import * as Y from "yjs";
import * as idb from "lib0/indexeddb.js";
import { YStore } from "./y-persistence";

export class YIndexDbStore implements YStore {
  private dbSize = 0;
  private dbRef = 0;

  private constructor(
    private db: IDBDatabase,
    private objectStore: IDBObjectStore
  ) {}

  static async load(dbName: string, storeName: string) {
    const db = await idb.openDB(dbName, (db) =>
      idb.createStores(db, [[storeName, { autoIncrement: true }]])
    );
    const [objectStore] = idb.transact(db, [storeName]);

    return new this(db, objectStore);
  }

  async getAllUpdates(): Promise<Uint8Array[]> {
    const updates = await idb.getAll(
      this.objectStore,
      idb.createIDBKeyRangeLowerBound(this.dbRef, false)
    );

    const lastKey = await idb.getLastKey(this.objectStore);
    this.dbRef = lastKey + 1;

    const count = await idb.count(this.objectStore);
    this.dbSize = count;

    return updates;
  }

  async pushUpdate(update: Uint8Array): Promise<number> {
    await idb.addAutoKey(this.objectStore, update);
    this.dbSize++;
    return this.dbSize;
  }

  async replaceWithSnapshot(doc: Y.Doc) {
    await this.getAllUpdates();

    const update = Y.encodeStateAsUpdate(doc);
    await idb.addAutoKey(this.objectStore, update);

    await idb.del(
      this.objectStore,
      idb.createIDBKeyRangeUpperBound(this.dbRef, true)
    );

    const count = await idb.count(this.objectStore);
    this.dbSize = count;
  }

  close() {
    this.db.close();
  }
}
