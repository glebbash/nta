import * as Y from "yjs";
import { Observable } from "lib0/observable.js";

export type YUpdate = Uint8Array;

export type YStore = {
  getAllUpdates(): Promise<YUpdate[]>;
  pushUpdate(update: YUpdate): Promise<number>;
  replaceWithSnapshot(doc: Y.Doc): Promise<void>;
  close(): void | Promise<void>;
};

export type YStoreLoader = () => YStore | Promise<YStore>;

export class YPersistence extends Observable<string> {
  synced = false;
  whenSynced: Promise<this>;

  private store?: YStore;
  private isDestroyed = false;
  private storeTimeoutId: number | undefined = undefined;

  /**
   * @param storeTimeoutMs Timeout until data is merged and persisted in the store.
   */
  constructor(
    public docId: string,
    public doc: Y.Doc,
    storeLoader: YStoreLoader,
    public storeTimeoutMs = 1000,
    public preferredTrimSize = 500
  ) {
    super();

    this.whenSynced = this.init(storeLoader).then(() => this);
  }

  private async init(loadStore: YStoreLoader) {
    this.store = await loadStore();

    // destroy() was called while store was loading
    if (this.isDestroyed) {
      this.store.close();
      return;
    }

    // bind to this so it can be used as an EventListener
    this.processDocUpdate = this.processDocUpdate.bind(this);
    this.destroy = this.destroy.bind(this);

    this.doc.on("update", this.processDocUpdate);
    this.doc.on("destroy", this.destroy);

    // no await here as next await also handles this one (I think)
    this.store.pushUpdate(Y.encodeStateAsUpdate(this.doc));

    const updates = await this.store.getAllUpdates();
    this.applyAllUpdates(updates);

    this.emit("synced", [this]);
    this.synced = true;

    return this;
  }

  private async processDocUpdate(update: Uint8Array, origin: unknown) {
    if (!this.store) return;
    if (origin === this) return;

    const updatesStored = await this.store.pushUpdate(update);

    if (updatesStored < this.preferredTrimSize) {
      return;
    }

    clearTimeout(this.storeTimeoutId);

    // debounce store call
    this.storeTimeoutId = setTimeout(() => {
      this.forceStoreSnapshot();
    }, this.storeTimeoutMs);
  }

  async forceStoreSnapshot() {
    await this.store?.replaceWithSnapshot(this.doc);
  }

  override destroy() {
    super.destroy();

    clearTimeout(this.storeTimeoutId);

    this.doc.off("update", this.processDocUpdate);
    this.doc.off("destroy", this.destroy);

    this.isDestroyed = true;

    this.store?.close();
  }

  private applyAllUpdates(updates: YUpdate[]) {
    Y.transact(
      this.doc,
      () => {
        updates.forEach((val) => Y.applyUpdate(this.doc, val));
      },
      this,
      false
    );
  }
}
