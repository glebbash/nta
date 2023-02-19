import { Box, TextField } from "@mui/material";

import { JsonValue } from "../../utils/json";
import { FileContext } from "../../hooks/useFileContext";

export type NumberItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: number;
  setValue: (value: JsonValue) => void;
};

export function NumberItem({ value, setValue }: NumberItemProps) {
  return (
    <Box>
      <TextField
        type="number"
        value={value}
        onChange={(e) => setValue(+e.target.value)}
      />
    </Box>
  );
}
