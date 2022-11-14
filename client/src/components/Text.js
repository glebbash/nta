import { html } from "../deps.js";
import { editable, useDataState } from "../utils/nta-core.js";

import { TextField, Typography } from "https://esm.sh/@mui/material@5.10.13";

export const Text = ({ data }) => {
  const [value, setValue] = useDataState(data, "value");

  if (editable.value) {
    const onChange = (event) => {
      setValue(event.target.value);
    };

    return html`
      <${TextField} variant="standard" value=${value} onChange=${onChange} />
    `;
  }

  return html`
    <${Typography} variant="body1">${value}<//>
  `;
};
