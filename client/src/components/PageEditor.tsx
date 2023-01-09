import {
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Box,
  Checkbox,
} from "@mui/material";

import { useSyncedPage } from "../hooks/useSyncedPage";
import { Page } from "../utils/api";
import { Item, PageCtx } from "../utils/types";
import { useState } from "react";

export function usePageEditorProps(props: {
  ctx: PageCtx;
  page: Page;
  onChange: (page: Page) => void;
}) {
  const [store, persistence] = useSyncedPage(props.page);
  const [selectedItems, setSelectedItems] = useState([] as string[]);

  return {
    ...props,
    store,
    selectedItems,
    setSelectedItems,
    persistence,
  };
}

export function PageEditor({
  page,
  ctx,
  store,
  selectedItems,
  setSelectedItems,
}: ReturnType<typeof usePageEditorProps>) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Typography variant="h4" sx={{ p: 2 }}>
        {page.data.meta.title as string}
      </Typography>
      <Box id="content" sx={{ overflow: "auto", p: 2 }}>
        {store.content.map((item) => (
          <PageItem
            key={item.id}
            item={item}
            ctx={ctx}
            selected={selectedItems.includes(item.id)}
            setSelected={(selected) => {
              if (selected) {
                setSelectedItems([...selectedItems, item.id]);
              } else {
                setSelectedItems(
                  selectedItems.filter((itemId) => itemId != item.id)
                );
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

type ItemProps = {
  ctx: PageCtx;
  item: Item;
  selected: boolean;
  setSelected: (selected: boolean) => void;
};

function PageItem({ item, ctx, selected, setSelected }: ItemProps) {
  return (
    <Box display="flex">
      {ctx.mode === "edit" && (
        <Checkbox
          checked={selected}
          onChange={(e) => setSelected(e.target.checked)}
        />
      )}
      <PageItemContent item={item} />
    </Box>
  );
}

function PageItemContent({ item }: { item: Item }) {
  if (item.type === "text") {
    return (
      <TextField
        value={item.value}
        onChange={(e) => (item.value = e.target.value)}
        fullWidth
        multiline
        sx={{ py: 1 }}
      />
    );
  }

  return (
    <FormControlLabel
      control={
        <Switch
          checked={item.checked}
          onChange={(e) => (item.checked = e.target.checked)}
        />
      }
      label="Some prop"
      sx={{ py: 1 }}
    />
  );
}
