import { Fragment, ReactNode, useCallback, useEffect, useState } from "react";
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
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import FileOpenIcon from "@mui/icons-material/FileOpen";

import { JsonEditor } from "./JsonEditor";
import { ActionDefinition, ActionPalette } from "./ActionPalette";
import {
  PagePersistence,
  usePagePersistence,
} from "../hooks/useFilePersistence";
import { loadJsonFile, saveJsonFile } from "../utils/api/fs-api";
import { findValueByJsonPath, getPathAtIndex } from "../utils/json-utils";

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

  const actions = buildActions(ctx);

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
                      p: 0.5,
                      my: 0.5,
                      ml: 0.5,
                      background: ctx.persistence.local ? "green" : "grey",
                      color: "white",
                    }}
                  >
                    L
                  </Typography>
                </Tooltip>
                <Tooltip title="Remote persistence">
                  <Typography
                    sx={{
                      p: 0.5,
                      my: 0.5,
                      mr: 0.5,
                      background: ctx.persistence.remote ? "green" : "grey",
                      color: "white",
                    }}
                  >
                    R
                  </Typography>
                </Tooltip>
              </Box>
              <ActionPalette
                sx={{ width: "sm" }}
                actions={actions}
                makeDefaultAction={(prompt) => ({
                  label: "Go to: " + prompt,
                  icon: <KeyboardDoubleArrowRightIcon />,
                  exec: () => {
                    setJsonPath(prompt);
                  },
                })}
              />
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

function buildActions(ctx: FileContext): ActionDefinition[] {
  return [
    {
      label: "Save file",
      icon: <SaveIcon />,
      exec: async () => {
        if (!ctx.persistence.remote) return;

        await ctx.persistence.remote?.forceStoreSnapshot();
        console.log("history cleared");
      },
    },
    {
      label: "Open file",
      icon: <FileOpenIcon />,
      exec: async () => {
        const fileName = prompt("File name");
        if (!fileName) return;

        await loadJsonFile(fileName).catch(async () => {
          await saveJsonFile(fileName, {});
        });

        ctx.setFileName(fileName);
      },
    },
  ];
}

const useHash = () => {
  const [hash, setHash] = useState(() => window.location.hash);

  const hashChangeHandler = useCallback(() => {
    setHash(window.location.hash);
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", hashChangeHandler);
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler);
    };
  }, []);

  const updateHash = useCallback(
    (newHash: string) => {
      if ("#" + newHash !== hash) window.location.hash = "#" + newHash;
    },
    [hash]
  );

  return [hash.slice(1), updateHash] as const;
};
