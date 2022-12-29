import { Fragment, useState, useEffect } from "react";
import {
  Add,
  AppBar,
  Box,
  CssBaseline,
  Search,
  IconButton,
  styled,
  Toolbar,
  MoreVert,
  Save,
} from "@mui";

import { useLoadPage } from "./utils/use-load-page";
import { PageView } from "./components/Page";
import { updatePage } from "./utils/api";

export function App() {
  const [pageId, setPageId] = useState("page1");

  const { data: page, placeholder: pagePlaceholder } = useLoadPage(pageId);

  const onSavePageClick = async () => {
    if (!page) return;

    await updatePage(page);

    console.log("page saved");
  };

  useEffect(() => {
    if (page) {
      document.title = (page.meta.title as string) ?? "New page";
    }
  }, [page]);

  const pageComponent = pagePlaceholder ?? (
    <PageView
      page={page}
      // @ts-ignore next
      onChange={(data) => (page.data = data)}
    />
  );

  return (
    <Fragment>
      <CssBaseline />
      <Box display={"block"} sx={{ pb: "64px", height: "100vh" }}>
        {pageComponent}
      </Box>
      <StyledAppBar position="fixed" color="primary">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={onSavePageClick}>
            <Save />
          </IconButton>
          <IconButton color="inherit">
            <Search />
          </IconButton>
          <IconButton color="inherit">
            <Add />
          </IconButton>
          <IconButton color="inherit">
            <MoreVert />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
    </Fragment>
  );
}

const StyledAppBar = styled(AppBar)({
  top: "auto",
  bottom: 0,
});
