import { html, React, ReactDOM } from "./deps.js";
import { CurrentPage, Query } from "./components/_mod.js";

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

import { Add, Menu, Search } from "https://esm.sh/@mui/icons-material@5.10.9";

ReactDOM.createRoot(document.querySelector("#root")).render(html`<${App} />`);

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

function App() {
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
          <${IconButton} color="inherit">
            <${Search} />
          <//>
        <//>
      <//>
    <//>
  `;
}

function useDrawer() {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = window !== undefined
    ? () => window.document.body
    : undefined;

  const drawer = html`
    <${Drawer}
      container=${container}
      variant="temporary"
      open=${mobileOpen}
      onClose=${handleDrawerToggle}
      ModalProps=${{ keepMounted: true }}
      sx=${{
    "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
  }}>
      <${Query} data=${{ selectable: true, onItemClick: handleDrawerToggle }} />
    <//>
  `;

  return { drawer, handleDrawerToggle };
}
