import { html, React } from "../deps.js";
import { savePage } from "../utils/api.js";
import {
  currentPageData,
  currentPageId,
  editable as editable,
  useSetSignal,
} from "../utils/nta-core.js";

import { Page, Query } from "./_mod.js";

import {
  AppBar,
  Box,
  CircularProgress,
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
        <${Page} data=${{ id: currentPageId.value }} />
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
          <${EditSaveButton} />
        <//>
      <//>
    <//>
  `;
}

const PageState = {
  Idle: "idle",
  Editing: "editing",
  Saving: "saving",
};

function EditSaveButton() {
  const [pageState, setPageState] = React.useState(PageState.Idle);
  const setPageEditable = useSetSignal(editable);

  const onClick = () => {
    switch (pageState) {
      case PageState.Idle:
        setPageEditable(true);
        setPageState(PageState.Editing);
        // TODO: start collaborative session?
        break;
      case PageState.Editing:
        setPageEditable(false);
        setPageState(PageState.Saving);
        savePage(currentPageId.peek(), currentPageData.peek()).then(() => {
          setPageState(PageState.Idle);
        });
        break;
      case PageState.Saving:
        // do nothing
        break;
    }
  };

  switch (pageState) {
    case PageState.Idle:
      return html`
        <${IconButton} color="inherit" onClick=${onClick}><${Edit} /><//>
      `;
    case PageState.Editing:
      return html`
        <${IconButton} color="inherit" onClick=${onClick}><${Save} /><//>
      `;
    case PageState.Saving:
      return html`
        <${IconButton} color="inherit" onClick=${onClick}><${CircularProgress} /><//>
      `;
  }
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
