import { Box, Checkbox } from "@mui/material";

import { JsonValue } from "../../utils/json";
import { FileContext } from "../../hooks/useFileContext";

export type BooleanItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: boolean;
  setValue: (value: JsonValue) => void;
};

export function BooleanItem({ value, setValue }: BooleanItemProps) {
  return (
    <Box>
      <Checkbox checked={value} onChange={(e) => setValue(e.target.checked)} />
    </Box>
  );
}
