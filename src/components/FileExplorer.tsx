import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { FileContext } from "../hooks/useFileContext";
import { Popup } from "./Popup";

export type FileExplorerProps = {
  ctx: FileContext;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function FileExplorer({ ctx, open, setOpen }: FileExplorerProps) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>File Explorer</DialogTitle>
        <DialogContent dividers>
          <DialogContentText tabIndex={-1}>
            <List>
              {ctx.fileHistory.map((file) => {
                return (
                  <ListItem
                    key={file.id}
                    disablePadding
                    secondaryAction={<Popup actions={[]} />}
                  >
                    <ListItemText primary="new file" secondary={file.id} />
                  </ListItem>
                );
              })}
            </List>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
