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
import { getPageTitle } from "../utils/get-page-title";
import { PageData } from "../hooks/usePagePersistence";

export type PageEditorProps = {
  ctx: PageContext;
  data: PageData;
  isSelected: (item: Item) => boolean;
  setSelected: (item: Item, selected: boolean) => void;
};

export function PageEditor({
  ctx,
  data,
  isSelected,
  setSelected,
}: PageEditorProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      {ctx.mode === "view" ? (
        <Typography variant="h4" sx={{ p: 2 }}>
          {getPageTitle(data.meta)}
        </Typography>
      ) : (
        <TextField
          value={getPageTitle(data.meta)}
          onChange={(e) => (data.meta.title = e.target.value)}
          fullWidth
          multiline
          sx={{ py: 1 }}
        />
      )}
      <Box id="content" sx={{ overflow: "auto", p: 2 }}>
        {data.content.map((item) => (
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
