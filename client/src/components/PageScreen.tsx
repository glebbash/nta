import { Fragment, ReactNode, useEffect, useState } from "react";
import useSWR from "swr";
import { Box, CssBaseline } from "@mui";
import { Grid, Paper } from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import CompareIcon from "@mui/icons-material/Compare";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UpdateDisabledIcon from "@mui/icons-material/UpdateDisabled";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { loadPage, Page, savePage } from "../utils/api";
import { PageEditor } from "./PageEditor";
import { ActionDefinition, ActionPalette } from "./ActionPalette";
import {
  PagePersistence,
  usePagePersistence,
} from "../hooks/usePagePersistence";

export type Mode = "edit" | "view";

export type PageContext = {
  mode: Mode;
  setMode: (mode: Mode) => void;

  pageId: Page["id"];
  setPageId: (pageId: Page["id"]) => void;

  selectedItems: string[];
  setSelectedItems: (selectedItems: string[]) => void;

  persistence: PagePersistence;
};

export function PageScreen() {
  const [pageId, setPageId] = useState("page1");
  const [mode, setMode] = useState<Mode>("view");
  const [selectedItems, setSelectedItems] = useState([] as string[]);
  const persistence = usePagePersistence(pageId);

  useEffect(() => {
    if (persistence.data) {
      document.title = (persistence.data.meta.title as string) ?? "New page";
    }
  }, [persistence.data]);

  const ctx: PageContext = {
    mode,
    setMode,
    pageId,
    setPageId,
    selectedItems,
    setSelectedItems,
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
          {getPageComponent(ctx)}
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

function getPageComponent(ctx: PageContext): ReactNode {
  if (!ctx.persistence.data) return <div>Loading...</div>;

  return (
    <PageEditor
      title={(ctx.persistence.data.meta.title as string) ?? "New Page"}
      ctx={ctx}
      items={ctx.persistence.data.content}
      isSelected={(item) => ctx.selectedItems.includes(item.id)}
      setSelected={(item, selected) => {
        if (selected) {
          ctx.setSelectedItems([...ctx.selectedItems, item.id]);
        } else {
          ctx.setSelectedItems(
            ctx.selectedItems.filter((itemId) => itemId != item.id)
          );
        }
      }}
    />
  );
}

function buildActions(ctx: PageContext): ActionDefinition[] {
  return [
    {
      label: "/Add Text",
      icon: <AbcIcon />,
      exec: () => {
        if (!ctx.persistence.data) return; // TODO: there is a better way

        ctx.persistence.data.content.push({
          id: crypto.randomUUID(),
          type: "text",
          value: "new",
        });
      },
    },
    {
      label: "/Add Toggle",
      icon: <ToggleOnIcon />,
      exec: () => {
        if (!ctx.persistence.data) return; // TODO: there is a better way

        ctx.persistence.data.content.push({
          id: crypto.randomUUID(),
          type: "switch",
          checked: false,
        });
      },
    },
    {
      label: "/Edit | Save",
      icon: <CompareIcon />,
      exec: () => {
        ctx.setMode(ctx.mode === "edit" ? "view" : "edit");
      },
    },
    {
      label: "/Delete Selected",
      icon: <DeleteForeverIcon />,
      exec: () => {
        if (!ctx.persistence.data) return; // TODO: there is a better way

        const items = ctx.persistence.data.content;
        let index = 0;
        while (index < items.length) {
          if (ctx.selectedItems.includes(items[index].id)) {
            items.splice(index, 1);
            continue;
          }
          index++;
        }
      },
    },
    {
      label: "/Clear Editing History",
      icon: <UpdateDisabledIcon />,
      exec: async () => {
        if (!ctx.persistence.remote) return;

        await ctx.persistence.remote?.forceStoreSnapshot();
        console.log("history cleared");
      },
    },
    {
      label: "/Open page",
      icon: <ExitToAppIcon />,
      exec: async () => {
        const pageId = prompt("Page id");
        if (!pageId) return;

        await loadPage(pageId).catch(async () => {
          await savePage({
            id: pageId,
            data: {
              type: "Page",
              meta: { title: "New page # " + pageId },
              content: [],
              history: [],
            },
          });
        });

        ctx.setPageId(pageId);
      },
    },
  ];
}
