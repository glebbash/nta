import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ReactNode } from "react";

export function Popup({
  actions,
}: {
  actions: { label: string; icon?: ReactNode; action: () => void }[];
}) {
  return (
    <PopupState variant="popover">
      {(popupState) => (
        <>
          <IconButton {...bindTrigger(popupState)}>
            <MoreVertIcon />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            {actions.map((item) => (
              <MenuItem
                key={item.label}
                onClick={() => {
                  item.action();
                  popupState.close();
                }}
              >
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText>{item.label}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </PopupState>
  );
}
