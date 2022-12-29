import { AcUnit, Typography } from "@mui";
import { css } from "@emotion/css";

import { useLoadPage } from "../utils/use-load-page";
import { PageEditor } from "./PageEditor";

// @ts-ignore next
export const Page = ({ id }) => {
  const { data, placeholder } = useLoadPage(id);
  if (placeholder) return placeholder;

  return <PageView page={data} onChange={() => void 0} />;
};

// @ts-ignore next
export const PageView = ({ page, onChange }) => {
  return (
    <div style={{ padding: "4px" }}>
      <AcUnit color="primary" sx={{ width: 64, height: 64, m: 2 }} />
      <Typography>{page.meta.title}</Typography>
      <PageEditor
        initialContent={page.data}
        placeholder="Enter text..."
        onChange={onChange}
        classNames={[
          css`
            &.ProseMirror {
              width: 100%;
              box-shadow: none !important;
            }
          `,
        ]}
      />
    </div>
  );
};
