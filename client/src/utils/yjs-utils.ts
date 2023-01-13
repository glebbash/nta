import * as Y from "yjs";
import { getYjsValue } from "@syncedstore/core";

import { JsonArray, JsonObject, JsonValue } from "./types";

export function isArray(value: JsonValue): value is JsonArray {
  return getYjsValue(value) instanceof Y.Array;
}

export function setArrayItem(array: JsonArray, index: number, item: JsonValue) {
  const yArray = getYjsValue(array) as Y.Array<JsonValue>;

  yArray.delete(index);
  yArray.insert(index, [item]);
}

export function renameObjectKey(
  object: JsonObject,
  oldKey: string,
  newKey: string
) {
  object[newKey] = JSON.parse(JSON.stringify(object[oldKey]));

  removeObjectKey(object, oldKey);
}

export function removeObjectKey(object: JsonObject, key: string) {
  const yMap = getYjsValue(object) as Y.Map<JsonValue>;
  yMap.delete(key);
}

export function replaceObjectContent(object: JsonObject, newData: JsonObject) {
  const yMap = getYjsValue(object) as Y.Map<JsonValue>;
  yMap.clear();
  for (const [k, v] of Object.entries(newData)) {
    yMap.set(k, v);
  }
}
