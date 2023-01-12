import { useState } from "react";
import {
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Box,
  Checkbox,
} from "@mui/material";

import { Item } from "../utils/types";
import { PageContext } from "./PageScreen";

export type PageEditorProps = {
  title: string;
  ctx: PageContext;
  items: Item[];
  isSelected: (item: Item) => boolean;
  setSelected: (item: Item, selected: boolean) => void;
};

export function PageEditor({
  title,
  ctx,
  items,
  isSelected,
  setSelected,
}: PageEditorProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Typography variant="h4" sx={{ p: 2 }}>
        {title}
      </Typography>
      <Box id="content" sx={{ overflow: "auto", p: 2 }}>
        {items.map((item) => (
          <PageItem
            key={item.id}
            item={item}
            ctx={ctx}
            selected={isSelected(item)}
            setSelected={(s) => setSelected(item, s)}
          />
        ))}
      </Box>
    </Box>
  );
}

type ItemProps = {
  ctx: PageContext;
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
