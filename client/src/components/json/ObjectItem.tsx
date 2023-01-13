import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import LoginIcon from "@mui/icons-material/Login";

import { JsonObject, JsonValue } from "../../utils/types";
import { FileContext } from "../JsonScreen";
import { JsonItem } from "./JsonItem";
import { getBaseValueForType } from "../../utils/json-utils";

export type ObjectItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: JsonObject;
  setValue: (value: JsonValue) => void;
};

export function ObjectItem({ ctx, preview, value }: ObjectItemProps) {
  if (preview) {
    return <Box>{"{ ... }"}</Box>;
  }

  const changeType = (key: string) => () => {
    const type = prompt(
      "type: number | string | boolean | array | object | null"
    );
    if (!type) return;

    const newValue = getBaseValueForType(type);
    if (newValue === undefined) {
      alert("Invalid type");
      return;
    }

    value[key] = newValue;
  };

  const enter = (key: string) => () => {
    ctx.setJsonPath(ctx.jsonPath + "." + key);
  };

  const addKey = () => {
    const key = prompt("key");
    if (!key) return;

    value[key] = null;
  };

  return (
    <Box>
      <Table>
        <TableBody>
          {Object.entries(value).map(([key, subValue]) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell>
                <Box display="flex">
                  <IconButton
                    aria-label="change type"
                    onClick={changeType(key)}
                  >
                    <ChangeCircleIcon />
                  </IconButton>
                  <IconButton aria-label="change type" onClick={enter(key)}>
                    <LoginIcon />
                  </IconButton>
                  <JsonItem
                    ctx={ctx}
                    preview={true}
                    value={subValue}
                    setValue={(newValue) => {
                      value[key] = newValue;
                    }}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={addKey}>Add key</Button>
    </Box>
  );
}
