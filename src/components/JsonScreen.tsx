import { Fragment, ReactNode, useState } from "react";
import {
  Box,
  CssBaseline,
  Breadcrumbs,
  Grid,
  Link,
  Paper,
  Typography,
  Tooltip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import GetAppIcon from "@mui/icons-material/GetApp";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

import { JsonEditor } from "./JsonEditor";
import {
  PagePersistence,
  usePagePersistence,
} from "../hooks/useFilePersistence";
import { findValueByJsonPath, getPathAtIndex } from "../utils/json-utils";
import { Popup } from "./Popup";
import { useHash } from "../hooks/useHash";
import { replaceObjectContent } from "../utils/yjs-utils";

export type Mode = "edit" | "view";

export type FileContext = {
  mode: Mode;
  setMode: (mode: Mode) => void;

  fileName: string;
  setFileName: (fileName: string) => void;

  jsonPath: string;
  setJsonPath: (jsonPath: string) => void;

  persistence: PagePersistence;
};

export function JsonScreen() {
  const [fileName, setFileName] = useState("files/test.json");
  const [mode, setMode] = useState<Mode>("view");
  const [jsonPath, setJsonPath] = useHash();
  const persistence = usePagePersistence(fileName);

  const ctx: FileContext = {
    mode,
    setMode,
    fileName,
    setFileName,
    jsonPath,
    setJsonPath,
    persistence,
  };

  return (
    <Fragment>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {getJsonComponent(ctx)}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6} lg={4}>
            <Paper sx={{ m: 2 }}>
              <Box display="flex">
                <Breadcrumbs
                  aria-label="breadcrumb"
                  sx={{ p: 1, flexGrow: 1 }}
                  separator="."
                >
                  {jsonPath
                    .split(".")
                    .slice(0, -1)
                    .map((key, index) => (
                      <Link
                        key={index}
                        underline="hover"
                        color="inherit"
                        href={`#${getPathAtIndex(jsonPath, index)}`}
                      >
                        {key}
                      </Link>
                    ))}
                  <Typography color="text.primary">
                    {jsonPath.split(".").at(-1)}
                  </Typography>
                </Breadcrumbs>
                <Tooltip title="Local persistence">
                  <Typography
                    sx={{
                      p: 1,
                      background: ctx.persistence.local ? "green" : "grey",
                      color: "white",
                    }}
                  >
                    L
                  </Typography>
                </Tooltip>
                <Popup
                  actions={[
                    {
                      label: "Undo",
                      icon: <UndoIcon />,
                      action: async () => {
                        ctx.persistence.undoManager!.undo();
                      },
                    },
                    {
                      label: "Redo",
                      icon: <RedoIcon />,
                      action: async () => {
                        ctx.persistence.undoManager!.redo();
                      },
                    },
                    {
                      label: "Export file",
                      icon: <FileUploadIcon />,
                      action: async () => {
                        const fileName = prompt("File name");
                        if (!fileName) return;

                        downloadFile(fileName, ctx.persistence.data!.$);
                      },
                    },
                    {
                      label: "Import file",
                      icon: <GetAppIcon />,
                      action: async () => {
                        const data = await selectFile("application/json")
                          .then((f) => f.text())
                          .then(JSON.parse);

                        if (
                          typeof data !== "object" ||
                          data === null ||
                          Array.isArray(data)
                        ) {
                          alert("Only json objects are supported");
                          return;
                        }

                        replaceObjectContent(ctx.persistence.data!.$, data);
                      },
                    },
                  ]}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}

function getJsonComponent(ctx: FileContext): ReactNode {
  if (!ctx.persistence.data) return <div>Loading...</div>;

  const value = findValueByJsonPath(ctx.persistence.data, ctx.jsonPath);
  if (value === undefined) {
    alert("Invalid path: " + ctx.jsonPath);
    ctx.setJsonPath("$");
    return;
  }

  return <JsonEditor ctx={ctx} value={value} />;
}

function downloadFile(fileName: string, data: unknown) {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));

  const download = document.createElement("a");
  download.setAttribute("href", dataStr);
  download.setAttribute("download", fileName);
  document.body.appendChild(download);
  download.click();
  download.remove();
}

function selectFile(contentType: string): Promise<File> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = false;
    input.accept = contentType;

    input.onchange = () => {
      resolve(input.files![0]);
    };

    input.click();
  });
}
