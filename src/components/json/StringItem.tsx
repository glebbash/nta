import { Box, TextField } from "@mui/material";

import { JsonValue } from "../../utils/types";
import { FileContext } from "../../hooks/useFileContext";

export type StringItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: string;
  setValue: (value: JsonValue) => void;
};

export function StringItem({ value, setValue, preview }: StringItemProps) {
  if (preview) {
    const lines = value.split("\n");
    return (
      <Box>
        <TextField
          value={lines[0]}
          onChange={(e) =>
            setValue(e.target.value + "\n" + lines.slice(1).join("\n"))
          }
          fullWidth
        />
      </Box>
    );
  }

  return (
    <Box>
      <TextField
        multiline={!preview}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Box>
  );
}
