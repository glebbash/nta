import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LoginIcon from "@mui/icons-material/Login";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { JsonObject, JsonValue } from "../../utils/types";
import { FileContext } from "../JsonScreen";
import { JsonItem } from "./JsonItem";
import { getBaseValueForType } from "../../utils/json-utils";
import { Popup } from "../Popup";

export type ObjectItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: JsonObject;
  setValue: (value: JsonValue) => void;
};

export function ObjectItem({ ctx, preview, value }: ObjectItemProps) {
  if (preview) {
    return (
      <Box m={2}>
        <Typography sx={{ fontWeight: "bold" }}>{"{ ... }"}</Typography>
      </Box>
    );
  }

  const changeType = (key: string) => {
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

  const enter = (key: string) => {
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
                <Stack direction="row">
                  <Box sx={{ flexGrow: 1 }}>
                    <JsonItem
                      ctx={ctx}
                      preview={true}
                      value={subValue}
                      setValue={(newValue) => {
                        value[key] = newValue;
                      }}
                    />
                  </Box>
                  <Popup
                    actions={[
                      {
                        label: "Change type",
                        icon: <AutorenewIcon />,
                        action: () => changeType(key),
                      },
                      {
                        label: "Enter",
                        icon: <LoginIcon />,
                        action: () => enter(key),
                      },
                    ]}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={addKey}>Add key</Button>
    </Box>
  );
}
