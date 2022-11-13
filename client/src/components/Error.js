import { html } from "../deps.js";

export const Error = ({ data: { message } }) => {
  return html`
    <p style=${{ color: "red" }}><b>Error:</b>${message}</p>
  `;
};
