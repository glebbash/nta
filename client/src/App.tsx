import { Fragment, useState, useEffect } from "react";
import {
  Add,
  Edit,
  Menu,
  Save,
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  Fab,
  IconButton,
  styled,
  Toolbar,
} from "@mui";

import { savePage } from "./utils/api";
import { useLoadPage } from "./utils/use-load-page";
import { PageView } from "./components/Page";
import { Query } from "./components/Query";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: "0 auto",
});

const StyledAppBar = styled(AppBar)({
  top: "auto",
  bottom: 0,
});

const PageState = {
  Idle: "idle",
  Editing: "editing",
  Saving: "saving",
};

export function App() {
  const [pageId, setPageId] = useState("page1");
  const [pageState, setPageState] = useState(PageState.Idle);
  const [editable, setEditable] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerKey, setDrawerKey] = useState(0);

  const { data: pageData, placeholder: pagePlaceholder } = useLoadPage(pageId);

  useEffect(() => {
    setEditable(pageState === PageState.Editing);

    if (pageState === PageState.Saving) {
      savePage(pageId, pageData).then(() => {
        setPageState(PageState.Idle);
        setDrawerKey(drawerKey + 1);
      });
      return;
    }

    if (pageState === PageState.Editing) {
      // TODO: start collaborative session?
    }
  }, [pageState]);

  useEffect(() => {
    if (pageData) {
      document.title = pageData.title;
    }
  });

  // @ts-ignore next
  const onPageSelect = ({ id }) => {
    setPageId(id);
    setDrawerOpen(false);
  };

  const pageComponent = pagePlaceholder ?? (
    <PageView
      data={pageData}
      state={{ editable }}
      // @ts-ignore next
      onChange={(data) => (pageData.content = data)}
    />
  );

  return (
    <Fragment>
      <CssBaseline />
      <Box sx={{ pb: "50px" }}> {pageComponent} </Box>
      <AppDrawer
        key={drawerKey}
        open={drawerOpen}
        setOpen={setDrawerOpen}
        onPageSelect={onPageSelect}
        selectedId={pageId}
      />
      <StyledAppBar position="fixed" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu />
          </IconButton>
          <StyledFab color="secondary" aria-label="add">
            <Add />
          </StyledFab>
          <Box sx={{ flexGrow: 1 }} />
          <EditSaveButton pageState={pageState} setPageState={setPageState} />
        </Toolbar>
      </StyledAppBar>
    </Fragment>
  );
}

// @ts-ignore next
function EditSaveButton({ pageState, setPageState }) {
  const onClick = () =>
    setPageState(
      pageState === PageState.Idle ? PageState.Editing : PageState.Saving
    );

  return (
    <IconButton
      color="inherit"
      onClick={onClick}
      disabled={pageState === PageState.Saving}
    >
      {pageState === PageState.Idle ? <Edit /> : <Save />}
    </IconButton>
  );
}

const drawerWidth = 240;
const StyledDrawer = styled(Drawer)({
  "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
});

// @ts-ignore next
function AppDrawer({ selectedId, open, setOpen, onPageSelect }) {
  return (
    <StyledDrawer
      variant="temporary"
      open={open}
      onClose={() => setOpen(false)}
      ModalProps={{ keepMounted: true }}
    >
      <Query
        data={{ view: "list", selectedId, onItemClick: onPageSelect }}
        state={{ editable: false }}
      />
    </StyledDrawer>
  );
}
