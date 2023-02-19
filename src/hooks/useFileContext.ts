import { useEffect } from "react";
import { FilePersistence, useFilePersistence } from "./useFilePersistence";
import { useHash } from "./useHash";
import { useLocalStorage } from "./useLocalStorage";

export type JsonFile = {
  id: string;
  jsonPath: string;
};

export type FileContext = {
  navigateTo: (fileId: string, jsonPath: string) => void;

  fileId: string;
  setFileId: (fileId: string) => void;

  jsonPath: string;
  setJsonPath: (jsonPath: string) => void;

  fileNames: Record<string, string>;
  setFileNames: (fileNames: Record<string, string>) => void;

  fileHistory: JsonFile[];
  setFileHistory: (fileHistory: JsonFile[]) => void;

  persistence: FilePersistence;
};

export function useFileContext(): FileContext {
  const [currentFileAndPath, setCurrentFileAndPath] = useHash();
  const { fileId, jsonPath } = parseFileIdAndJsonPath(currentFileAndPath);
  const persistence = useFilePersistence(fileId);

  const [fileHistory, setFileHistory] = useLocalStorage<JsonFile[]>(
    "fileHistory",
    [{ id: crypto.randomUUID(), jsonPath: "~" }]
  );

  const [fileNames, setFileNames] = useLocalStorage<Record<string, string>>(
    "fileNames",
    {}
  );

  const navigateTo = (fileId: string, jsonPath: string) => {
    setCurrentFileAndPath(fileId + jsonPath);
    setFileHistory([
      { id: fileId, jsonPath },
      ...fileHistory.filter((f) => f.id !== fileId),
    ]);
  };

  const setFileId = (newFileId: string) => {
    navigateTo(newFileId, jsonPath);
  };

  const setJsonPath = (newJsonPath: string) => {
    navigateTo(fileId, newJsonPath);
  };

  useEffect(() => {
    if (fileId === "") {
      const lastOpenedFile = fileHistory[0];
      navigateTo(lastOpenedFile.id, lastOpenedFile.jsonPath);
    } else if (!fileHistory.find((f) => f.id === fileId)) {
      navigateTo(fileId, jsonPath);
    }
  }, [fileId]);

  return {
    navigateTo,
    fileId,
    setFileId,
    jsonPath,
    setJsonPath,
    fileNames,
    setFileNames,
    fileHistory,
    setFileHistory,
    persistence,
  };
}

function parseFileIdAndJsonPath(hash: string): {
  fileId: string;
  jsonPath: string;
} {
  const [fileId, jsonPath] = hash.split("~", 2);
  return { fileId, jsonPath: "~" + (jsonPath ?? "") };
}
