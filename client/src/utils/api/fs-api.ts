import { BASE_URL } from "../constants";
import { handleErrors } from "./utils";

const FS_URL = BASE_URL + "api/fs/";

export async function loadFile(path: string) {
  return handleErrors(fetch(FS_URL + path)).then((r) => r.text());
}

export async function saveFile(path: string, data: string) {
  return handleErrors(
    fetch(FS_URL + path, {
      method: "POST",
      body: data,
    })
  );
}

export async function listFiles(path: string) {
  return handleErrors(fetch(FS_URL + path)).then((r) => r.json());
}
