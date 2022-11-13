import { html } from "../deps.js";
import { useQuery } from "../utils/use-query.js";
import { createComponent } from "../utils/create-component.js";
import { execQuery } from "../utils/api.js";
import { currentPage } from "./CurrentPage.js";

export const Query = ({ data: { view, setCurrent } }) => {
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
    const onClick = setCurrent
      ? () => {
        currentPage.value = page.path;
      }
      : null;

    const pageTitle = (setCurrent && page.path === currentPage.value)
      ? html`<b>${page.title}</b>`
      : page.title;

    return html`
      <li key=${page.path} onClick=${onClick}>
        ${pageTitle}
      </li>
    `;
  });

  return html`
    <ul>
      ${pathItems}
    </ul>
  `;
};
