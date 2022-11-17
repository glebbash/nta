import { html, React } from "../deps.js";
import { useQuery } from "../utils/use-query.js";
import { loadPage } from "../utils/api.js";
import {
  createComponent,
  currentPageData,
  currentPageId,
} from "../utils/nta-core.js";

import { Header } from "./Header.js";

import { AcUnit } from "https://esm.sh/@mui/icons-material@5.10.9";

export const Page = ({ data: { id } }) => {
  const { data, error } = useQuery(`page/${id}`, () => loadPage(id));

  if (error) return html`<div>failed to load</div>`;
  if (!data) return html`<div>loading...</div>`;

  return html`
    <${PageView} id=${id} data=${data}/>
  `;
};

const PageView = ({ id, data }) => {
  React.useEffect(() => {
    if (currentPageId.peek() === id) {
      document.title = data.title;
      currentPageData.value = data;
    }
  });

  const headerData = {
    get value() {
      return data.title;
    },
    set value(value) {
      data.title = value;
    },
  };

  return html`
    <div style=${{ padding: "4px" }}>
      <${AcUnit} color="primary" sx=${{ width: 64, height: 64, m: 2 }} />
      <${Header} data=${headerData}/>
      ${data.content.map(createComponent)}
    </div>
  `;
};
