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

import { JsonEditor } from "./JsonEditor";
import { findValueByJsonPath, getPathAtIndex } from "../utils/json-utils";
import { Popup } from "./Popup";
import { replaceObjectContent } from "../utils/yjs-utils";
import { saveLocalFile, selectLocalFile } from "../utils/fs-ops";
import { FileContext, useFileContext } from "../hooks/useFileContext";
import { FileExplorer } from "./FileExplorer";

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

                      saveLocalFile(fileName, ctx.persistence.data!.$);
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

                      replaceObjectContent(ctx.persistence.data!.$, data);
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
  if (!ctx.persistence.data) return <div>Loading...</div>;

  const value = findValueByJsonPath(ctx.persistence.data, ctx.jsonPath);
  if (value === undefined) {
    alert("Invalid path: " + ctx.jsonPath);
    ctx.setJsonPath("$");
    return;
  }

  return <JsonEditor ctx={ctx} value={value} />;
}
