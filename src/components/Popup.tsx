import { ReactNode } from "react";
import {
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Popover,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from "material-ui-popup-state/hooks";
import { InjectedProps } from "material-ui-popup-state";

type ActionItem = {
  label: string;
  icon?: ReactNode;
  action?: () => void;
  layout?: (
    node: ReactNode,
    key: string,
    popupState: InjectedProps
  ) => ReactNode;
};

export function Popup({
  anchor,
  actions,
  header,
  onClose,
}: {
  anchor?: ReactNode;
  actions: ActionItem[];
  header?: ReactNode;
  onClose?: () => void;
}) {
  const popupState = usePopupState({
    variant: "popover",
  });

  return (
    <>
      {anchor ? (
        <Box {...bindTrigger(popupState)}>{anchor}</Box>
      ) : (
        <IconButton {...bindTrigger(popupState)}>
          <MoreVertIcon />
        </IconButton>
      )}
      <Popover
        {...bindPopover(popupState)}
        onClose={() => {
          onClose?.();
          popupState.close();
        }}
      >
        <Box sx={{ py: 1 }}>
          {header}
          {actions.map((item) => {
            const component = (
              <MenuItem
                key={item.label}
                onClick={
                  item.action
                    ? () => {
                        item.action!();
                        onClose?.();
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
        </Box>
      </Popover>
    </>
  );
}
