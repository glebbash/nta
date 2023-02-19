import { Box } from "@mui/material";

import { JsonItem } from "./json/JsonItem";
import { FileContext } from "../hooks/useFileContext";
import { JsonValue, setValueOnPath } from "../utils/json";

export type JsonEditorProps = {
  ctx: FileContext;
  value: JsonValue;
};

export function JsonEditor({ ctx, value: data }: JsonEditorProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Box id="content" sx={{ overflow: "auto", p: 2 }}>
        <JsonItem
          ctx={ctx}
          preview={false}
          value={data}
          setValue={(newValue) => {
            const valueSet = setValueOnPath(
              ctx.persistence.data,
              ctx.jsonPath,
              newValue
            );

            if (!valueSet) {
              alert("Invalid path: " + ctx.jsonPath);
              ctx.setJsonPath("~");
              return;
            }
          }}
        />
      </Box>
    </Box>
  );
}
