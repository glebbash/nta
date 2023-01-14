import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import PopupState, {
  bindTrigger,
  bindMenu,
  InjectedProps,
} from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ReactNode } from "react";

export function Popup({
  anchor,
  actions,
}: {
  anchor?: ReactNode;
  actions: {
    label: string;
    icon?: ReactNode;
    action?: () => void;
    layout?: (
      node: ReactNode,
      key: string,
      popupState: InjectedProps
    ) => ReactNode;
  }[];
}) {
  return (
    <PopupState variant="popover">
      {(popupState) => (
        <>
          {anchor ? (
            <Box {...bindTrigger(popupState)}>{anchor}</Box>
          ) : (
            <IconButton {...bindTrigger(popupState)}>
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu {...bindMenu(popupState)}>
            {actions.map((item) => {
              const component = (
                <MenuItem
                  key={item.label}
                  onClick={
                    item.action
                      ? () => {
                          item.action!();
                          popupState.close();
                        }
                      : () => {}
                  }
                >
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  <ListItemText>{item.label}</ListItemText>
                </MenuItem>
              );

              return (
                item.layout?.(component, item.label, popupState) ?? component
              );
            })}
          </Menu>
        </>
      )}
    </PopupState>
  );
}
