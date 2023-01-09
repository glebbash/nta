import { ReactNode, useState } from "react";

import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";

export type ActionDefinition = {
  label: string;
  icon?: ReactNode;
  exec: () => void;
};

export function ActionPalette({
  actions,
  makeDefaultAction,
}: {
  actions: ActionDefinition[];
  makeDefaultAction: (prompt: string) => ActionDefinition;
}) {
  const [command, setCommand] = useState("");

  return (
    <Autocomplete
      inputValue={command}
      onInputChange={(_, value) => setCommand(value)}
      onChange={(_, action) => {
        action.exec();
        setCommand("");
      }}
      autoHighlight
      disableClearable
      options={actions}
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
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.icon ?? <BoltIcon />}
          <Typography sx={{ ml: 2 }}>{option.label}</Typography>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          placeholder="/commands"
          type="search"
        />
      )}
    />
  );
}
