import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { frontmatter } from "../utils/frontmatter-cm-extension";

export type MdEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MdEditor({ value, onChange }: MdEditorProps) {
  return (
    <CodeMirror
      style={{ width: "100%" }}
      value={value}
      onChange={onChange}
      extensions={[
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          extensions: [frontmatter],
        }),
      ]}
    />
  );
}
