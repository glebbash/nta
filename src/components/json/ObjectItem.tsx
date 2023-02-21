import { Box, Button, List, Stack, TextField, Typography } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LoginIcon from "@mui/icons-material/Login";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";

import { FileContext } from "../../hooks/useFileContext";
import { JsonItem } from "./JsonItem";
import { Popup } from "../Popup";
import { newCreateJsonValueActions } from "../../utils/create-json-value-actions";
import {
  JsonObject,
  JsonValue,
  renameObjectKey,
  removeObjectKey,
  getDefaultValueForType,
} from "../../utils/json";
import { useState } from "react";

export type ObjectItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: JsonObject;
  setValue: (value: JsonValue) => void;
};

export function ObjectItem({ ctx, preview, value }: ObjectItemProps) {
  const [newKey, setNewKey] = useState("");

  if (preview) {
    return (
      <Box m={2}>
        <Typography sx={{ fontWeight: "bold" }}>
          {Object.keys(value).length > 0 ? "{ ... }" : "{ }"}
        </Typography>
      </Box>
    );
  }

  const renameKey = (key: string) => {
    const newKey = prompt("key");
    if (!newKey) return;

    renameObjectKey(value, key, newKey);
  };

  const addNewKeyValue = (key: string, newValue: JsonValue) => {
    if (value[key] !== undefined) {
      return alert("Key already exists");
    }

    value[key] = newValue;
  };

  return (
    <Box>
      <List disablePadding>
        {Object.entries(value).map(([key, subValue]) => (
          <Box key={key}>
            <Typography variant="subtitle1">{key}</Typography>
            <Stack direction="row">
              <Box sx={{ flexGrow: 1, overflow: "auto" }}>
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
                        actions={newCreateJsonValueActions((jsonType) => {
                          value[key] = getDefaultValueForType(jsonType)!;
                          popupState.close();
                        })}
                      />
                    ),
                  },
                  {
                    label: "Rename",
                    icon: <DriveFileRenameOutlineIcon />,
                    action: () => renameKey(key),
                  },
                  {
                    label: "Delete",
                    icon: <DeleteIcon />,
                    action: () => removeObjectKey(value, key),
                  },
                ]}
              />
            </Stack>
          </Box>
        ))}
      </List>
      <Popup
        header={
          <TextField
            label="New key"
            sx={{ m: 1 }}
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
        }
        anchor={<Button>Add key</Button>}
        actions={[
          ...newCreateJsonValueActions((jsonType) => {
            addNewKeyValue(newKey, getDefaultValueForType(jsonType)!);
          }),
        ]}
        onClose={() => setNewKey("")}
      />
    </Box>
  );
}
