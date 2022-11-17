import { html, React } from "../deps.js";
import { useQuery } from "../utils/use-query.js";
import { loadPage } from "../utils/api.js";
import {
  createComponent,
  currentPageData,
  currentPageId,
} from "../utils/nta-core.js";

import { Typography } from "https://esm.sh/@mui/material@5.10.13";
import { AcUnit } from "https://esm.sh/@mui/icons-material@5.10.9";

export const Page = ({ data: { id } }) => {
  const { data, error } = useQuery(`page/${id}`, () => loadPage(id));

  React.useEffect(() => {
    if (data && currentPageId.peek() === id) {
      document.title = data.title;
      currentPageData.value = data;
    }
  });

  if (error) return html`<div>failed to load</div>`;
  if (!data) return html`<div>loading...</div>`;

  const { title, content } = data;

  return html`
    <div style=${{ padding: "4px" }}>
      <${AcUnit} color="primary" sx=${{ width: 64, height: 64, m: 2 }} />
      <${Typography} variant="h2">${title}<//>
      ${content.map(createComponent)}
    </div>
  `;
};
