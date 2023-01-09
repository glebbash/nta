import * as Y from "yjs";
import { fromUint8Array, toUint8Array } from "js-base64";

import { YStore } from "./y-persistence";
import { loadPage, Page, savePage } from "./api";

export class YServerStore implements YStore {
  constructor(private page: Page) {}

  async pushUpdate(update: Uint8Array): Promise<number> {
    const page = await loadPage(this.page.id);
    const newHistory = [...page.data.history, fromUint8Array(update)];

    await savePage({
      id: page.id,
      data: {
        ...page.data,
        history: newHistory,
      },
    });

    return newHistory.length;
  }

  async getAllUpdates(): Promise<Uint8Array[]> {
    const page = await loadPage(this.page.id);
    return page.data.history.map(toUint8Array);
  }

  async replaceWithSnapshot(doc: Y.Doc): Promise<void> {
    const update = Y.encodeStateAsUpdate(doc);
    const newHistory = [fromUint8Array(update)];

    await savePage({
      id: this.page.id,
      data: {
        ...this.page.data,
        content: doc.getArray("content").toJSON(),
        history: newHistory,
      },
    });
  }

  close() {}
}
