import { getYjsValue, SyncedText, Y } from "@syncedstore/core";

export type JsonValue =
  | number
  | boolean
  | SyncedText
  | JsonArray
  | JsonObject
  | null;

export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

// general

export function getValueOnPath(
  data: { ["~"]: JsonObject },
  jsonPath: string
): JsonValue | undefined {
  const pathParts = jsonPath.split(".");
  let value = data as any;

  for (const key of pathParts) {
    try {
      value = value[key];
    } catch (e) {
      return undefined;
    }
  }

  return value;
}

export function setValueOnPath(
  data: { "~": JsonObject },
  jsonPath: string,
  newValue: JsonValue
): boolean {
  const pathParts = jsonPath.split(".");
  const key = pathParts.at(-1)!;
  const path = pathParts.slice(0, -1).join(".");

  const parent = getValueOnPath(data, path);
  if (parent === undefined) {
    return false;
  }

  if (isArray(parent)) {
    setArrayItem(parent, +key, newValue);
  } else {
    (parent as JsonObject)[key] = newValue;
  }

  return true;
}

export function getDefaultValueForType(type: string): JsonValue | undefined {
  switch (type) {
    case "number":
      return 0;
    case "string":
      return new SyncedText("");
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    case "null":
      return null;
    default:
      return undefined;
  }
}

// string utils

export function isString(value: JsonValue): value is SyncedText {
  return value instanceof SyncedText;
}

// array utils

export function isArray(value: JsonValue): value is JsonArray {
  return getYjsValue(value) instanceof Y.Array;
}

export function setArrayItem(array: JsonArray, index: number, item: JsonValue) {
  const yArray = getYjsValue(array) as Y.Array<JsonValue>;

  yArray.delete(index);
  yArray.insert(index, [item]);
}

// object utils

export function renameObjectKey(
  object: JsonObject,
  oldKey: string,
  newKey: string
) {
  object[newKey] = cloneValue(object[oldKey]);

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
    yMap.set(key, cloneValue(value));
  }
}

// helpers

function cloneValue(value: JsonValue): any {
  if (value === undefined) {
    throw new Error("Invalid value");
  }

  if (
    value === null ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (isString(value)) {
    return new SyncedText(value.toString());
  }

  if (Array.isArray(value)) {
    return Y.Array.from(value.map(cloneValue));
  }

  return new Y.Map(Object.entries(value).map(([k, v]) => [k, cloneValue(v)]));
}
