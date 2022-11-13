import { html } from "../deps.js";
import { useQuery } from "../utils/use-query.js";
import { loadPage } from "../utils/api.js";
import { createComponent } from "../utils/create-component.js";

export const Page = ({ data: { url } }) => {
  const { data, error } = useQuery(`/page/${url}`, () => loadPage(url));

  if (error) return html`<div>failed to load</div>`;
  if (!data) return html`<div>loading...</div>`;

  const { title, content } = data;

  return html`
    <div style=${{ border: "1px solid black" }}>
      <p><b>${title}</b></p>
      ${content.map(createComponent)}
    </div>
  `;
};
