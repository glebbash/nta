import { useQuery } from "../utils/use-query";
import { createComponent } from "../utils/nta-core";
import { listPages } from "../utils/api";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { FiberManualRecord } from "@mui/icons-material";

type Page = { id: string; title: string };

// @ts-ignore next
export const Query = ({ data: { view, selectedId, onItemClick }, state }) => {
  view = view ?? "list";
  if (view !== "list") {
    return createComponent(
      {
        type: "Error",
        message: "Only list view is supported",
      },
      state
    );
  }

  const { data, error } = useQuery(`query`, () => listPages());
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const pages = data as Page[];

  const pageItems = pages.map((page) => {
    const onClick = () => {
      onItemClick?.(page);
    };

    const selected = selectedId === page.id;

    return (
      <ListItem key={page.id} disablePadding>
        <ListItemButton selected={selected} onClick={onClick}>
          <ListItemIcon>
            <FiberManualRecord />
            <ListItemText primary={page.title} />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    );
  });

  return <List>{pageItems}</List>;
};
