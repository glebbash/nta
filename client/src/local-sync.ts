import { PGlite } from "@electric-sql/pglite";
import * as Y from "yjs";

const DOC_STATE_TABLE = "_doc_state";
type DocStateRecord = {
  id: string;
  state: Uint8Array;
};

export class LocalSync {
  public debug = false;

  private constructor(private db: PGlite) {}

  static async load(dbName: string) {
    const db = new PGlite(`idb://${dbName}`);
    await db.query(`
      CREATE TABLE IF NOT EXISTS ${DOC_STATE_TABLE} (
        id TEXT PRIMARY KEY,
        state BYTEA NOT NULL
      );
      `);

    return new LocalSync(db);
  }

  async syncDoc(doc: Y.Doc, id: string) {
    doc.on("update", async (_update, origin) => {
      if (origin === this) {
        return;
      }

      const state = Y.encodeStateAsUpdate(doc);
      await this.storeDocumentState(id, state);

      if (this.debug) {
        console.log(`doc ${id} stored`);
      }
    });

    const state = await this.loadDocumentState(id);
    if (state !== undefined) {
      Y.applyUpdate(doc, state, this);

      if (this.debug) {
        console.log(`doc ${id} loaded`);
      }
    }
  }

  private async storeDocumentState(documentId: string, state: Uint8Array) {
    await this.db.query(
      `
      INSERT INTO ${DOC_STATE_TABLE} (id, state)
      VALUES ($1, $2)
      ON CONFLICT (id) DO UPDATE SET state = $2;
      `,
      [documentId, state]
    );
  }

  private async loadDocumentState(documentId: string) {
    const { rows } = await this.db.query<Pick<DocStateRecord, "state">>(
      `
        SELECT state
        FROM ${DOC_STATE_TABLE}
        WHERE id = $1;
        `,
      [documentId]
    );

    return (rows[0] as Partial<(typeof rows)[0]>)?.state;
  }
}
