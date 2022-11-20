import { WysiwygEditor } from "@remirror/react-editors/wysiwyg";
import { AcUnit } from "@mui/icons-material";
import { OnChangeJSON } from "@remirror/react";

import { useLoadPage } from "../utils/use-load-page";
import { Header } from "./Header";

// @ts-ignore next
export const Page = ({ data: { id }, state }) => {
  const { data, placeholder } = useLoadPage(id);
  if (placeholder) return placeholder;

  return <PageView data={data} state={state} onChange={() => void 0} />;
};

// @ts-ignore next
export const PageView = ({ data, state, onChange }) => {
  const headerData = {
    get value() {
      return data.title;
    },
    set value(value) {
      data.title = value;
    },
  };

  return (
    <div style={{ padding: "4px" }}>
      <AcUnit color="primary" sx={{ width: 64, height: 64, m: 2 }} />
      <Header data={headerData} state={state} />
      <WysiwygEditor
        initialContent={data.content}
        placeholder="Enter text..."
        editable={state.editable}
      >
        <OnChangeJSON onChange={onChange} />
      </WysiwygEditor>
    </div>
  );
};
