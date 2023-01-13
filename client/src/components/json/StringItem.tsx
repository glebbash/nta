import { Box, TextField } from "@mui/material";

import { JsonValue } from "../../utils/types";
import { FileContext } from "../JsonScreen";

export type StringItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: string;
  setValue: (value: JsonValue) => void;
};

export function StringItem({ value, setValue }: StringItemProps) {
  return (
    <Box>
      <TextField value={value} onChange={(e) => setValue(e.target.value)} />
    </Box>
  );
}
