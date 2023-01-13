import { Box, Button, IconButton, List, ListItem } from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import LoginIcon from "@mui/icons-material/Login";

import { getBaseValueForType } from "../../utils/json-utils";
import { JsonArray, JsonValue } from "../../utils/types";
import { FileContext } from "../JsonScreen";
import { JsonItem } from "./JsonItem";
import { setArrayItem } from "../../utils/yjs-utils";

export type ArrayItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: JsonArray;
  setValue: (value: JsonValue) => void;
};

export function ArrayItem({ ctx, preview, value }: ArrayItemProps) {
  if (preview) {
    return <Box>[ ... ]</Box>;
  }

  const addItem = () => {
    value.push(null);
  };

  const changeType = (index: number) => () => {
    const type = prompt(
      "type: number | string | boolean | array | object | null"
    );
    if (!type) return;

    const newValue = getBaseValueForType(type);
    if (newValue === undefined) {
      alert("Invalid type");
      return;
    }

    setArrayItem(value, index, newValue);
  };

  const enter = (index: number) => () => {
    ctx.setJsonPath(ctx.jsonPath + "." + index);
  };

  return (
    <Box>
      <List>
        {value.map((subValue, index) => (
          <ListItem key={index}>
            <IconButton aria-label="change type" onClick={changeType(index)}>
              <ChangeCircleIcon />
            </IconButton>
            <IconButton aria-label="change type" onClick={enter(index)}>
              <LoginIcon />
            </IconButton>
            <JsonItem
              ctx={ctx}
              preview={preview}
              value={subValue}
              setValue={(newValue) => {
                setArrayItem(value, index, newValue);
              }}
            />
          </ListItem>
        ))}
      </List>
      <Button onClick={addItem}>Add item</Button>
    </Box>
  );
}
