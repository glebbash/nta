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
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";

import { JsonObject, JsonValue } from "../../utils/types";
import { FileContext } from "../../hooks/useFileContext";
import { JsonItem } from "./JsonItem";
import { getBaseValueForType } from "../../utils/json-utils";
import { Popup } from "../Popup";
import { removeObjectKey, renameObjectKey } from "../../utils/yjs-utils";
import { buildJsonTypeActions } from "../../utils/json-type-actions";

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

  const renameKey = (key: string) => {
    const newKey = prompt("key");
    if (!newKey) return;

    renameObjectKey(value, key, newKey);
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
                        label: "Enter",
                        icon: <LoginIcon />,
                        action: () => ctx.setJsonPath(ctx.jsonPath + "." + key),
                      },
                      {
                        label: "Change type",
                        icon: <AutorenewIcon />,
                        layout: (node, popupKey, popupState) => (
                          <Popup
                            key={popupKey}
                            anchor={node}
                            actions={buildJsonTypeActions((jsonType) => {
                              value[key] = getBaseValueForType(jsonType)!;
                              popupState.close();
                            })}
                          />
                        ),
                      },
                      {
                        label: "Rename key",
                        icon: <DriveFileRenameOutlineIcon />,
                        action: () => renameKey(key),
                      },
                      {
                        label: "Delete key",
                        icon: <DeleteIcon />,
                        action: () => removeObjectKey(value, key),
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
