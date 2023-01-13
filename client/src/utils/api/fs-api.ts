import { BASE_URL } from "../constants";
import { JsonObject } from "../types";
import { handleErrors } from "./utils";

const FS_URL = BASE_URL + "api/fs/";

export async function loadJsonFile(path: string): Promise<JsonObject> {
  return loadFile(path).then(JSON.parse);
}

export async function loadFile(path: string) {
  return handleErrors(fetch(FS_URL + path)).then((r) => r.text());
}

export async function saveJsonFile(path: string, data: JsonObject) {
  return saveFile(path, JSON.stringify(data));
}

export async function saveFile(path: string, data: string) {
  return handleErrors(
    fetch(FS_URL + path, {
      method: "POST",
      body: data,
    })
  );
}

export type File = { name: string };

export async function listFiles(path: string): Promise<File[]> {
  return handleErrors(fetch(FS_URL + path + "/")).then((r) => r.json());
}
