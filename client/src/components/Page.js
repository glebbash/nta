import { html, React } from "../deps.js";
import { useQuery } from "../utils/use-query.js";
import { loadPage } from "../utils/api.js";
import { currentPage } from "./CurrentPage.js";
import { createComponent } from "../utils/create-component.js";

export const Page = ({ data: { url } }) => {
  const { data, error } = useQuery(`page/${url}`, () => loadPage(url));

  React.useEffect(() => {
    if (data && currentPage.peek() === url) {
      document.title = data.title;
    }
  });

  if (error) return html`<div>failed to load</div>`;
  if (!data) return html`<div>loading...</div>`;

  const { title, content } = data;

  return html`
    <div style=${{ padding: "4px" }}>
      <p><b>${title}</b></p>
      ${content.map(createComponent)}
    </div>
  `;
};
