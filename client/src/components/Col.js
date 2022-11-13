import { html } from "../deps.js";
import { createComponent } from "../utils/create-component.js";

export const Col = ({ data: { content } }) => {
  return html`
    <div style=${{ display: "flex", flexDirection: "column" }}>
      ${content.map(createComponent)}
    </div>
  `;
};
