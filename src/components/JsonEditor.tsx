import { Box } from "@mui/material";

import { JsonItem } from "./json/JsonItem";
import { FileContext } from "./JsonScreen";
import { JsonObject, JsonValue } from "../utils/types";
import { findValueByJsonPath } from "../utils/json-utils";
import { isArray, setArrayItem } from "../utils/yjs-utils";

export type PageEditorProps = {
  ctx: FileContext;
  value: JsonValue;
};

export function JsonEditor({ ctx, value: data }: PageEditorProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Box id="content" sx={{ overflow: "auto", p: 2 }}>
        <JsonItem
          ctx={ctx}
          preview={false}
          value={data}
          setValue={(newValue) => {
            const pathParts = ctx.jsonPath.split(".");
            const key = pathParts.at(-1)!;
            const path = pathParts.slice(0, -1).join(".");

            const parent = findValueByJsonPath(ctx.persistence.data!, path);
            if (parent === undefined) {
              alert("Invalid path: " + ctx.jsonPath);
              ctx.setJsonPath("$");
              return;
            }

            if (isArray(parent)) {
              setArrayItem(parent, +key, newValue);
            } else {
              (parent as JsonObject)[key] = newValue;
            }
          }}
        />
      </Box>
    </Box>
  );
}
