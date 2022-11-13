import { html } from "../deps.js";
import { useQuery } from "../utils/use-query.js";
import { loadPage } from "../utils/api.js";
import { createComponent } from "../utils/create-component.js";

export const Load = ({ data: { url } }) => {
  const { data, error } = useQuery(`load/${url}`, () => loadPage(url));

  if (error) return html`<div>failed to load</div>`;
  if (!data) return html`<div>loading...</div>`;

  return createComponent(data);
};
