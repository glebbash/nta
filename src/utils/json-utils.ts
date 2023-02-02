import { JsonObject, JsonValue } from "./types";

export function getBaseValueForType(type: string): JsonValue | undefined {
  switch (type) {
    case "number":
      return 0;
    case "string":
      return "";
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

export function findValueByJsonPath(
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

export function getPathAtIndex(jsonPath: string, index: number): string {
  return jsonPath
    .split(".")
    .slice(0, 1 + index)
    .join(".");
}
