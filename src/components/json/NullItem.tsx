import { Box } from "@mui/material";

import { JsonValue } from "../../utils/json";
import { FileContext } from "../../hooks/useFileContext";

export type NullItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: null;
  setValue: (value: JsonValue) => void;
};

export function NullItem({}: NullItemProps) {
  return <Box>null</Box>;
}
