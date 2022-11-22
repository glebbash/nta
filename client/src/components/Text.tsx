import { useDataState } from "../utils/nta-core";

import { TextField, Typography } from "@mui";

// @ts-ignore next
export const Text = ({ data, state }) => {
  const [value, setValue] = useDataState(data, "value");

  if (state.editable) {
    return (
      <TextField
        variant="standard"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    );
  }

  return <Typography variant="body1">{value}</Typography>;
};
