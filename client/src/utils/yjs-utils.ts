import * as Y from "yjs";
import { getYjsValue } from "@syncedstore/core";

import { JsonArray, JsonValue } from "./types";

export function isArray(value: JsonValue): value is JsonArray {
  return getYjsValue(value) instanceof Y.Array;
}

export function setArrayItem(items: JsonArray, index: number, item: JsonValue) {
  const arr = getYjsValue(items) as Y.Array<JsonValue>;

  arr.delete(index);
  arr.insert(index, [item]);
}
