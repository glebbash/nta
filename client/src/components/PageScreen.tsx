import { Fragment, useState } from "react";
import { Box, CssBaseline } from "@mui";

import { Page, savePage } from "../utils/api";
import { PageEditor, usePageEditorProps } from "./PageEditor";
import { Autocomplete, Paper, TextField } from "@mui/material";
import { PageCtx } from "../utils/types";

export function PageScreen({ page }: { page: Page }) {
  const [ctx, setCtx] = useState<PageCtx>({ mode: "view" });

  const pageProps = usePageEditorProps({
    ctx,
    page,
    onChange: ({ data }) => (page.data = data),
  });

  const actions = {
    "clear editing history": async () => {
      if (!page) return;

      await savePage(page);
      await pageProps.persistence.current?.forceStoreSnapshot();

      console.log("history cleared");
    },
    "edit / save": () => {
      setCtx({ ...ctx, mode: ctx.mode === "edit" ? "view" : "edit" });
    },
    "add text": () => {
      pageProps.store.content.push({
        id: crypto.randomUUID(),
        type: "text",
        value: "new",
      });
    },
    "add switch": () => {
      pageProps.store.content.push({
        id: crypto.randomUUID(),
        type: "switch",
        checked: false,
      });
    },
    "delete selected": () => {
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
  };

  const actionNames = Object.keys(actions);
  actionNames.sort();

  const execCommand = (command: string) => {
    if (command.startsWith("Search: ")) {
      alert("Search is not implemented yet");
      return;
    }
    actions[command as keyof typeof actions]();
  };

  const [command, setCommand] = useState("");

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
        <Paper sx={{ p: 2 }}>
          <Autocomplete
            inputValue={command}
            onInputChange={(_, value) => setCommand(value)}
            value=""
            onChange={(_, value) => {
              execCommand(value);
              setCommand("");
            }}
            autoHighlight
            disableClearable
            options={[] as string[]}
            filterOptions={(_, state) => {
              const results = actionNames.filter((option) =>
                option.toLowerCase().startsWith(state.inputValue.toLowerCase())
              );

              if (state.inputValue.length != 0) {
                results.push("Search: " + state.inputValue);
              }

              return results;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                placeholder="/commands"
                type="search"
              />
            )}
          />
        </Paper>
      </Box>
    </Fragment>
  );
}
