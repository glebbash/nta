import { useQuery } from "../utils/use-query";
import { listPages } from "../utils/api";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  FiberManualRecord,
} from "@mui";

// @ts-ignore next
export const Query = ({ view, selectedId, onItemClick }) => {
  if (view && view !== "list") {
    throw new Error("Only list view is supported");
  }

  const { data, error } = useQuery(`query`, () => listPages());
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <List>
      {data.map((page) => (
        <ListItem key={page.id} disablePadding>
          <ListItemButton
            selected={selectedId === page.id}
            onClick={() => onItemClick?.(page)}
          >
            <ListItemIcon>
              <FiberManualRecord />
              <ListItemText
                primary={(page.meta.title as string) ?? `<${page.id}>`}
              />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
