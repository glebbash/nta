import { html, React } from "../deps.js";
import { editable as editable, useSetSignal } from "../utils/nta-core.js";

import { CurrentPage, Query } from "./_mod.js";

import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Fab,
  IconButton,
  styled,
  Toolbar,
} from "https://esm.sh/@mui/material@5.10.13";

import {
  Add,
  Edit,
  Menu,
  Save,
} from "https://esm.sh/@mui/icons-material@5.10.9";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

export function App() {
  const { drawer, handleDrawerToggle } = useDrawer();

  const AppBarSX = {
    top: "auto",
    bottom: 0,
  };

  return html`
    <${React.Fragment}>
      <${CssBaseline} />
      <${Box} sx=${{ pb: "50px" }}>
        <${CurrentPage} />
      <//>
      ${drawer}
      <${AppBar} position="fixed" color="primary" sx=${AppBarSX}>
        <${Toolbar}>
          <${IconButton} color="inherit" aria-label="open drawer" onClick=${handleDrawerToggle}>
            <${Menu} />
          <//>
          <${StyledFab} color="secondary" aria-label="add">
            <${Add} />
          <//>
          <${Box} sx=${{ flexGrow: 1 }} />
          <${EditButton} />
        <//>
      <//>
    <//>
  `;
}

function EditButton() {
  const setEditable = useSetSignal(editable);

  const toggleEdit = () => {
    setEditable(!editable.value);
  };

  return html`
    <${IconButton} color="inherit" onClick=${toggleEdit}>
      <${editable.value ? Save : Edit} />
    <//>
  `;
}

function useDrawer() {
  const drawerWidth = 240;
  const [open, setOpen] = React.useState(false);

  const DrawerSX = {
    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawer = html`
    <${Drawer}
      container=${window?.document?.body}
      variant="temporary"
      open=${open}
      onClose=${handleDrawerToggle}
      ModalProps=${{ keepMounted: true }}
      sx=${DrawerSX}>
      <${Query} data=${{ selectable: true, onItemClick: handleDrawerToggle }} />
    <//>
  `;

  return { drawer, handleDrawerToggle };
}
