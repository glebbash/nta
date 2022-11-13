import { html } from "../deps.js";

export const Text = ({ data: { value } }) => {
  return html`
    <p>${value}</p>
  `;
};
