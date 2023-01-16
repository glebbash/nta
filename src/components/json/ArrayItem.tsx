import { Box, Button, List, ListItem, Stack, Typography } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LoginIcon from "@mui/icons-material/Login";
import DeleteIcon from "@mui/icons-material/Delete";

import { getBaseValueForType } from "../../utils/json-utils";
import { JsonArray, JsonValue } from "../../utils/types";
import { FileContext } from "../../hooks/useFileContext";
import { JsonItem } from "./JsonItem";
import { setArrayItem } from "../../utils/yjs-utils";
import { Popup } from "../Popup";
import { buildJsonTypeActions } from "../../utils/json-type-actions";

export type ArrayItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: JsonArray;
  setValue: (value: JsonValue) => void;
};

export function ArrayItem({ ctx, preview, value }: ArrayItemProps) {
  if (preview) {
    return (
      <Box m={2}>
        <Typography sx={{ fontWeight: "bold" }}>
          {value.length > 0 ? "[ ... ]" : "[ ]"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <List>
        {value.map((subValue, index) => (
          <ListItem key={index}>
            <Stack direction="row" sx={{ width: "100%" }}>
              <Box sx={{ flexGrow: 1 }}>
                <JsonItem
                  ctx={ctx}
                  preview={true}
                  value={subValue}
                  setValue={(newValue) => {
                    setArrayItem(value, index, newValue);
                  }}
                />
              </Box>
              <Popup
                actions={[
                  {
                    label: "Enter",
                    icon: <LoginIcon />,
                    action: () => ctx.setJsonPath(ctx.jsonPath + "." + index),
                  },
                  {
                    label: "Change type",
                    icon: <AutorenewIcon />,
                    layout: (node, popupKey, popupState) => (
                      <Popup
                        key={popupKey}
                        anchor={node}
                        actions={buildJsonTypeActions((jsonType) => {
                          const newValue = getBaseValueForType(jsonType)!;
                          setArrayItem(value, index, newValue);
                          popupState.close();
                        })}
                      />
                    ),
                  },
                  {
                    label: "Delete item",
                    icon: <DeleteIcon />,
                    action: () => value.splice(index, 1),
                  },
                ]}
              />
            </Stack>
          </ListItem>
        ))}
      </List>
      <Popup
        anchor={<Button>Add item</Button>}
        actions={buildJsonTypeActions((jsonType) => {
          value.push(getBaseValueForType(jsonType)!);
        })}
      />
    </Box>
  );
}
