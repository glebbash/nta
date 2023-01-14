export type JsonValue =
  | number
  | string
  | boolean
  | JsonArray
  | JsonObject
  | null;

export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
