import { ReactNode, useState } from "react";

import {
  Autocomplete,
  Box,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";

export type ActionDefinition = {
  label: string;
  icon?: ReactNode;
  exec: () => void;
};

export function ActionPalette({
  actions,
  makeDefaultAction,
  sx = {},
}: {
  actions: ActionDefinition[];
  makeDefaultAction: (prompt: string) => ActionDefinition;
  sx?: SxProps;
}) {
  const [command, setCommand] = useState("");

  return (
    <Autocomplete
      sx={sx}
      inputValue={command}
      onInputChange={(_, value) => setCommand(value)}
      onChange={(_, action) => {
        action.exec();
        setCommand("");
      }}
      filterOptions={(_, state) => {
        const input = state.inputValue;
        const results = actions.filter((action) =>
          action.label.toLowerCase().startsWith(input.toLowerCase())
        );

        if (input.length != 0) {
          results.push(makeDefaultAction(input));
        }

        return results;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          placeholder="/commands"
          type="search"
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.icon ?? <BoltIcon />}
          <Typography sx={{ ml: 2 }}>{option.label}</Typography>
        </Box>
      )}
      value={"" as never}
      options={["" as never] as ActionDefinition[]}
      autoHighlight
      disableClearable
    />
  );
}
