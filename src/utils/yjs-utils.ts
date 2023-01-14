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
  for (const [key, value] of Object.entries(newData)) {
    yMap.set(key, createYValue(value));
  }
}

export function createYValue(value: JsonValue): any {
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

export function createYMap(obj: JsonObject, map = new Y.Map()) {
  for (const [key, value] of Object.entries(obj)) {
    map.set(key, createYValue(value));
  }
  return map;
}

export function createYArray(values: JsonArray) {
  const array = new Y.Array();
  array.push(values.map(createYValue));
  return array;
}
