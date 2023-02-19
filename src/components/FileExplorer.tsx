import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";

import { FileContext, JsonFile } from "../hooks/useFileContext";
import { Popup } from "./Popup";

export type FileExplorerProps = {
  ctx: FileContext;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function FileExplorer({ ctx, open, setOpen }: FileExplorerProps) {
  const buildFileActions = (file: JsonFile) => [
    {
      label: "Rename",
      icon: <DriveFileRenameOutlineIcon />,
      action: () => {
        const newName = prompt("New file name");
        if (!newName) return;

        ctx.setFileNames({ ...ctx.fileNames, [file.id]: newName });
      },
    },
    {
      label: "Delete",
      icon: <DeleteIcon />,
      action: () => {
        ctx.setFileHistory(ctx.fileHistory.filter((_) => _.id !== file.id));
        ctx.setFileNames(
          Object.fromEntries(
            Object.entries(ctx.fileNames).filter(
              ([fileId]) => fileId !== file.id
            )
          )
        );
      },
    },
  ];

  const openFile = (file: JsonFile) => {
    ctx.navigateTo(file.id, file.jsonPath);
    setOpen(false);
  };

  const createFile = () => {
    ctx.setFileId(crypto.randomUUID());
    ctx.setJsonPath("~");
    setOpen(false);
  };

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
          <List disablePadding>
            {ctx.fileHistory.map((file) => {
              const fileNamePrefix = file.id === ctx.fileId ? "-> " : "";
              return (
                <ListItem
                  key={file.id}
                  disablePadding
                  secondaryAction={<Popup actions={buildFileActions(file)} />}
                >
                  <ListItemButton onClick={() => openFile(file)}>
                    <ListItemText
                      primary={
                        fileNamePrefix + (ctx.fileNames[file.id] ?? "New file")
                      }
                      secondary={
                        <Typography fontFamily="monospace">
                          {file.id}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={createFile}>Create file</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
