import "@remirror/styles/all.css";

import { FC, PropsWithChildren, useCallback } from "react";
import jsx from "refractor/lang/jsx.js";
import typescript from "refractor/lang/typescript.js";
import { ExtensionPriority, RemirrorJSON } from "remirror";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  TableExtension,
  TrailingNodeExtension,
} from "remirror/extensions";
import {
  EditorComponent,
  OnChangeJSON,
  Remirror,
  ThemeProvider,
  useRemirror,
} from "@remirror/react";
import { AllStyledComponent } from "@remirror/styles/emotion";

import type { RemirrorProps } from "@remirror/react";
import styled from "@emotion/styled";

export type MarkdownEditorProps = Partial<
  Pick<
    RemirrorProps,
    "initialContent" | "editable" | "autoFocus" | "hooks" | "classNames"
  >
> & {
  placeholder?: string;
  onChange: (content: RemirrorJSON) => void;
};

const StyledEditorComponent = styled(EditorComponent)(() => ({
  width: "100%",
}));

/**
 * The editor which is used to create the annotation. Supports formatting.
 */
export const PageEditor: FC<PropsWithChildren<MarkdownEditorProps>> = ({
  placeholder,
  children,
  onChange,
  ...rest
}) => {
  const extensions = useCallback(
    () => [
      new PlaceholderExtension({ placeholder }),
      new LinkExtension({ autoLink: true }),
      new BoldExtension(),
      new StrikeExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new LinkExtension(),
      new BlockquoteExtension(),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new ListItemExtension({
        priority: ExtensionPriority.High,
        enableCollapsible: true,
      }),
      new CodeExtension(),
      new CodeBlockExtension({ supportedLanguages: [jsx, typescript] }),
      new TrailingNodeExtension(),
      new TableExtension(),
      new MarkdownExtension({ copyAsMarkdown: false }),
      /**
       * `HardBreakExtension` allows us to create a newline inside paragraphs.
       * e.g. in a list item
       */
      new HardBreakExtension(),
    ],
    [placeholder]
  );

  const { manager } = useRemirror({
    extensions,
    stringHandler: "markdown",
  });

  const mdExt = manager.getExtension(MarkdownExtension);

  return (
    <AllStyledComponent>
      <ThemeProvider>
        <Remirror manager={manager} autoFocus {...rest}>
          <StyledEditorComponent />
          <OnChangeJSON onChange={onChange} />
          {children}
        </Remirror>
      </ThemeProvider>
    </AllStyledComponent>
  );
};
