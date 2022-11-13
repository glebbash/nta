import { html } from "../deps.js";
import { useQuery } from "../utils/use-query.js";
import { createComponent } from "../utils/create-component.js";
import { execQuery } from "../utils/api.js";
import { CurrentPageContext } from "./CurrentPage.js";

export const Query = ({ data: { view } }) => {
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
    const onClick = (currentPage) => {
      currentPage.set(page.path);
    };

    const item = (currentPage) =>
      html`
        <li key=${page.path} onClick=${() => onClick(currentPage)}>
          ${page.title}
        </li>`;

    return html`
      <${CurrentPageContext.Consumer}>${item}</>
    `;
  });

  return html`
    <ul>
      ${pathItems}
    </ul>
  `;
};
