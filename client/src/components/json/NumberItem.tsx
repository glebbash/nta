import { Box, TextField } from "@mui/material";

import { JsonValue } from "../../utils/types";
import { FileContext } from "../JsonScreen";

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
        onChange={(e) => setValue(e.target.value)}
      />
    </Box>
  );
}
