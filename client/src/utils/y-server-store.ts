import * as Y from "yjs";
import { fromUint8Array, toUint8Array } from "js-base64";

import { YStore, YUpdate } from "./y-persistence";
import { loadJsonFile, saveJsonFile } from "./api/fs-api";
import { JsonArray, JsonObject, JsonValue } from "./types";

export class YServerStore implements YStore {
  private historyFileName: string;

  constructor(private fileName: string) {
    this.historyFileName =
      this.fileName.slice(0, -".json".length) + ".hist.json";
  }

  async pushUpdate(update: Uint8Array): Promise<number> {
    const history = await loadJsonFile(this.historyFileName).then(
      (data) => data.history as string[],
      () => [] as string[]
    );
    const newHistory = [...history, fromUint8Array(update)];

    await saveJsonFile(this.historyFileName, { history: newHistory });

    return newHistory.length;
  }

  async getAllUpdates(): Promise<Uint8Array[]> {
    const history = await loadJsonFile(this.historyFileName).then(
      (data) => data.history as string[],
      () => [] as string[]
    );

    if (history.length === 0) {
      return [jsonToUpdate(await loadJsonFile(this.fileName))];
    }

    return history.map(toUint8Array);
  }

  async replaceWithSnapshot(doc: Y.Doc): Promise<void> {
    const data = doc.getMap("$").toJSON();
    const update = Y.encodeStateAsUpdate(doc);

    const newHistory = [fromUint8Array(update)];
    await saveJsonFile(this.historyFileName, { history: newHistory });

    await saveJsonFile(this.fileName, data);
  }

  close() {}
}

function jsonToUpdate(obj: JsonValue): YUpdate {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj))
    throw new Error("Invalid root node: " + JSON.stringify(obj));

  const doc = new Y.Doc();

  createYMap(obj, doc.getMap("$"));

  return Y.encodeStateAsUpdate(doc);
}

function createYValue(value: JsonValue): unknown {
  if (value === undefined) {
    throw new Error("Invalid value");
  }

  if (
    value === null ||
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return createYArray(value);
  }

  return createYMap(value);
}

function createYMap(obj: JsonObject, map = new Y.Map()) {
  for (const [key, value] of Object.entries(obj)) {
    map.set(key, createYValue(value));
  }
  return map;
}

function createYArray(values: JsonArray) {
  const array = new Y.Array();
  array.push(values.map(createYValue));
  return array;
}
