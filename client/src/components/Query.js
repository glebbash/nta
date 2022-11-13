import { html } from "../deps.js";
import { createComponent } from "../utils/create-component.js";

export const Query = ({ data: { view } }) => {
  view = view ?? "list";
  if (view !== "list") {
    return createComponent({
      type: "Error",
      message: "Only list view is supported",
    });
  }

  return html`
    <div>
      TODO: query
    </div>
  `;
};
