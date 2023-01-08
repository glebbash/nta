import { Fragment, useState, ReactNode, useEffect } from "react";
import {
  Add,
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  styled,
  Toolbar,
  Save,
  Edit,
  Visibility,
} from "@mui";

import { useLoadPage } from "./utils/use-load-page";
import { savePage } from "./utils/api";
import { MdEditor } from "./components/MdEditor";
import { MdViewer } from "./components/MdViewer";

type Mode = "edit" | "view";

export function App() {
  const [pageId, setPageId] = useState("main");
  const [mode, setMode] = useState<Mode>("edit");

  const { data: page, placeholder: pagePlaceholder } = useLoadPage(pageId);

  const toggleMode = () => {
    setMode(mode === "edit" ? "view" : "edit");
  };

  const onSavePageClick = async () => {
    if (!page) return;

    await savePage(page);

    console.log("page saved");
  };

  useEffect(() => {
    const listener = (event: globalThis.KeyboardEvent) => {
      if (
        (event.code === "KeyI" && mode === "view") ||
        (event.code === "Escape" && mode === "edit")
      ) {
        toggleMode();
        return;
      }
      if (event.ctrlKey && event.code === "KeyS") {
        onSavePageClick();
        event.preventDefault();
        return;
      }
    };

    document.addEventListener("keydown", listener);

    return () => document.removeEventListener("keydown", listener);
  });

  let content: ReactNode = pagePlaceholder;
  if (page) {
    if (mode === "edit") {
      content = (
        <MdEditor
          value={page.data}
          onChange={(data: string) => (page.data = data)}
        />
      );
    } else {
      content = <MdViewer value={page.data} />;
    }
  }

  return (
    <Fragment>
      <CssBaseline />
      <Box display="flex" sx={{ width: "100%", height: "100vh" }}>
        {content}
      </Box>
      <StyledAppBar position="fixed" color="primary">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" onClick={onSavePageClick}>
            <Save />
          </IconButton>
          <IconButton color="inherit" onClick={toggleMode}>
            {mode === "edit" ? <Visibility /> : <Edit />}
          </IconButton>
          <IconButton color="inherit">
            <Add />
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
