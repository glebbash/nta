#!/usr/bin/env -S deno -A --unstable-kv --node-modules-dir=false --no-lock
import { Hocuspocus } from "npm:@hocuspocus/server@^2.15.2";
import * as Y from "npm:yjs@^13.6.24";

const kv = await Deno.openKv();

const server = new Hocuspocus({
  port: Number(Deno.env.get("PORT") ?? "3000"),

  // deno-lint-ignore require-await
  async onAuthenticate(data) {
    if (data.token !== Deno.env.get("TOKEN")) {
      throw new Error("Not authorized!");
    }

    return {};
  },

  async onLoadDocument(data) {
    const doc = new Y.Doc();

    const storedDoc = await kv.get(["documents", data.documentName]);
    if (storedDoc.value) {
      Y.applyUpdate(doc, storedDoc.value as Uint8Array);
    }

    return doc;
  },

  async onStoreDocument(data) {
    const update = Y.encodeStateAsUpdate(data.document);
    await kv.set(["documents", data.documentName], update);
  },
});

server.listen();
