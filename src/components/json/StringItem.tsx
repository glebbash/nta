import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useCodeMirror } from "@uiw/react-codemirror";
import { SyncedText } from "@syncedstore/core";
import { yCollab } from "y-codemirror.next";
import { markdown } from "@codemirror/lang-markdown";
import { foldAll } from "@codemirror/language";

import { JsonValue } from "../../utils/json";
import { FileContext } from "../../hooks/useFileContext";

export type StringItemProps = {
  ctx: FileContext;
  preview: boolean;
  value: SyncedText;
  setValue: (value: JsonValue) => void;
};

export function StringItem({ ctx, value, preview }: StringItemProps) {
  const editorRef = useRef();

  const { view, setContainer } = useCodeMirror({
    value: value.toString(),
    container: editorRef.current!,
    basicSetup: { lineNumbers: false },
    extensions: [
      markdown(),
      yCollab(value, ctx.persistence.syncProvider!.awareness, {
        // TODO: support undoManager?
        undoManager: false,
      }),
    ],
  });

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [editorRef.current, preview]);

  useEffect(() => {
    if (preview && view) {
      foldAll(view);
    }
  }, [view]);

  return (
    <Box>
      <div ref={editorRef as never} />
    </Box>
  );
}
