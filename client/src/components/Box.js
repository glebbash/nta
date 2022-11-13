import { html } from "../deps.js";
import { createComponent } from "../utils/create-component.js";

export const Box = ({ data: { content, align } }) => {
  return html`
    <div style=${{
    display: "flex",
    ...(align === "vertical" && { flexDirection: "column" }),
  }}>
      ${content.map(createComponent)}
    </div>
  `;
};
