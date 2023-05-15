import { Fragment, ReactNode, useState } from "react";
import {
  Box,
  CssBaseline,
  Breadcrumbs,
  Grid,
  Link,
  Typography,
  Divider,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FolderIcon from "@mui/icons-material/Folder";
import CodeIcon from "@mui/icons-material/Code";
import * as syncedStore from "@syncedstore/core";

import { JsonEditor } from "./JsonEditor";
import { Popup } from "./Popup";
import { saveLocalFile, selectLocalFile } from "../utils/fs-ops";
import { FileContext, useFileContext } from "../hooks/useFileContext";
import { FileExplorer } from "./FileExplorer";
import { getValueOnPath, replaceObjectContent } from "../utils/json";

export function JsonScreen() {
  const ctx = useFileContext();
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);

  return (
    <Fragment>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <CssBaseline />
        <FileExplorer
          ctx={ctx}
          open={fileExplorerOpen}
          setOpen={setFileExplorerOpen}
        />
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
        <Divider />
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6} lg={4}>
            <Box display="flex" sx={{ m: 2 }}>
              <Breadcrumbs
                aria-label="breadcrumb"
                sx={{ p: 1, flexGrow: 1 }}
                separator="."
              >
                {ctx.jsonPath
                  .split(".")
                  .slice(0, -1)
                  .map((key, index) => (
                    <Link
                      key={index}
                      underline="hover"
                      color="inherit"
                      href={`#${ctx.fileId}${getPathAtIndex(
                        ctx.jsonPath,
                        index
                      )}`}
                    >
                      {key}
                    </Link>
                  ))}
                <Typography color="text.primary">
                  {ctx.jsonPath.split(".").at(-1)}
                </Typography>
              </Breadcrumbs>
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
                    label: "File explorer",
                    icon: <FolderIcon />,
                    action: async () => {
                      setFileExplorerOpen(true);
                    },
                  },
                  {
                    label: "Export file",
                    icon: <FileUploadIcon />,
                    action: async () => {
                      const fileName = prompt("File name");
                      if (!fileName) return;

                      saveLocalFile(fileName, ctx.persistence.data!["~"]);
                    },
                  },
                  {
                    label: "Import file",
                    icon: <GetAppIcon />,
                    action: async () => {
                      const data = await selectLocalFile("application/json")
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

                      replaceObjectContent(ctx.persistence.data!["~"], data);
                    },
                  },
                  {
                    label: "Run setup",
                    icon: <CodeIcon />,
                    action: async () => {
                      const setupSource =
                        ctx.persistence.data["~"].$setup?.toString();

                      if (setupSource === undefined) {
                        return;
                      }

                      const setupModule = await import(
                        /* @vite-ignore */
                        "data:text/javascript;base64," + btoa(setupSource)
                      );

                      if (typeof setupModule.setup === "function") {
                        await setupModule.setup(ctx, { syncedStore });
                      }
                    },
                  },
                ]}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}

function getJsonComponent(ctx: FileContext): ReactNode {
  if (!ctx.persistence.local) return <div>Loading...</div>;

  const value = getValueOnPath(ctx.persistence.data, ctx.jsonPath);
  if (value === undefined) {
    return (
      <div>Path {ctx.jsonPath} does not exist or file is not fully loaded</div>
    );
  }

  return <JsonEditor ctx={ctx} value={value} />;
}

function getPathAtIndex(jsonPath: string, index: number): string {
  return jsonPath
    .split(".")
    .slice(0, 1 + index)
    .join(".");
}
