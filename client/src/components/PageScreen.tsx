import { Fragment, useEffect, useState } from "react";

import { Box, CssBaseline } from "@mui";
import { Grid, Paper } from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CompareIcon from "@mui/icons-material/Compare";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UpdateDisabledIcon from "@mui/icons-material/UpdateDisabled";
import SearchIcon from "@mui/icons-material/Search";

import { PageCtx } from "../utils/types";
import { Page, savePage } from "../utils/api";
import { PageEditor, usePageEditorProps } from "./PageEditor";
import { ActionDefinition, ActionPalette } from "./ActionPalette";

export function PageScreen({ page }: { page: Page }) {
  const [ctx, setCtx] = useState<PageCtx>({ mode: "view" });

  useEffect(() => {
    if (page) {
      document.title = (page.data.meta.title as string) ?? "New page";
    }
  }, [page]);

  const pageProps = usePageEditorProps({
    ctx,
    page,
  });

  const actions = buildActions(pageProps, setCtx);

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
          <PageEditor {...pageProps} />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={6} lg={4}>
            <Paper sx={{ m: 2 }}>
              <ActionPalette
                sx={{ width: "sm" }}
                actions={actions}
                makeDefaultAction={(prompt) => ({
                  label: "Search: " + prompt,
                  icon: <SearchIcon />,
                  exec: () => {
                    alert("Search is not implemented yet");
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

function buildActions(
  pageProps: ReturnType<typeof usePageEditorProps>,
  setCtx: (ctx: PageCtx) => void
): ActionDefinition[] {
  return [
    {
      label: "Add Text",
      icon: <AbcIcon />,
      exec: () => {
        pageProps.store.content.push({
          id: crypto.randomUUID(),
          type: "text",
          value: "new",
        });
      },
    },
    {
      label: "Add Toggle",
      icon: <ToggleOnIcon />,
      exec: () => {
        pageProps.store.content.push({
          id: crypto.randomUUID(),
          type: "switch",
          checked: false,
        });
      },
    },
    {
      label: "Edit / Save",
      icon: <CompareIcon />,
      exec: () => {
        setCtx({
          ...pageProps.ctx,
          mode: pageProps.ctx.mode === "edit" ? "view" : "edit",
        });
      },
    },
    {
      label: "Delete Selected",
      icon: <DeleteForeverIcon />,
      exec: () => {
        const items = pageProps.store.content;
        let index = 0;
        while (index < items.length) {
          if (pageProps.selectedItems.includes(items[index].id)) {
            items.splice(index, 1);
            continue;
          }
          index++;
        }
      },
    },
    {
      label: "Clear Editing History",
      icon: <UpdateDisabledIcon />,
      exec: async () => {
        await savePage(pageProps.page);
        await pageProps.persistence.current?.forceStoreSnapshot();

        console.log("history cleared");
      },
    },
  ];
}
