import { html } from "../deps.js";

import { Typography } from "https://esm.sh/@mui/material@5.10.13";

export const Text = ({ data: { value } }) => {
  return html`
    <${Typography} variant="body1">${value}<//>
  `;
};
