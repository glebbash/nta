import { html } from "../deps.js";
import { createComponent } from "../utils/create-component.js";

export const Row = ({ data: { content } }) => {
  return html`
    <div style=${{ display: "flex" }}>
      ${content.map(createComponent)}
    </div>
  `;
};
