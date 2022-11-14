import { html } from "../deps.js";
import { createComponent } from "../utils/nta-core.js";

export const Box = ({ data: { content, align } }) => {
  const boxStyle = {
    display: "flex",
    ...(align === "vertical" && { flexDirection: "column" }),
  };

  return html`
    <div style=${boxStyle}>
      ${content.map(createComponent)}
    </div>
  `;
};
