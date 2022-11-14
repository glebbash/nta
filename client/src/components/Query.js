import { html } from "../deps.js";
import { useQuery } from "../utils/use-query.js";
import { createComponent } from "../utils/create-component.js";
import { execQuery } from "../utils/api.js";
import { currentPage } from "./CurrentPage.js";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "https://esm.sh/@mui/material@5.10.13";

import { FiberManualRecord } from "https://esm.sh/@mui/icons-material@5.10.9";

export const Query = ({ data: { view, selectable, onItemClick } }) => {
  view = view ?? "list";
  if (view !== "list") {
    return createComponent({
      type: "Error",
      message: "Only list view is supported",
    });
  }

  const { data, error } = useQuery(`query`, () => execQuery());
  if (error) return html`<div>failed to load</div>`;
  if (!data) return html`<div>loading...</div>`;

  /** @type {{path: string, title: string}[]} */
  const pages = data;

  const pathItems = pages.map((page) => {
    const onClick = () => {
      if (selectable) {
        currentPage.value = page.path;
      }
      onItemClick?.();
    };

    const selected = selectable && page.path === currentPage.value;

    return html`
      <${ListItem} key=${page.path}  disablePadding>
        <${ListItemButton} selected=${selected} onClick=${onClick}>
          <${ListItemIcon}>
            <${FiberManualRecord} />
          <//>
          <${ListItemText} primary=${page.title} />
        <//>
      <//>
    `;
  });

  return html`
    <${List}>
      ${pathItems}
    <//>
  `;
};
