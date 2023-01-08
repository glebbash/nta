import { MdEditor } from "./MdEditor";

import { useLoadPage } from "../utils/use-load-page";

// @ts-ignore next
export const Page = ({ id }) => {
  const { data, placeholder } = useLoadPage(id);
  if (placeholder) return placeholder;

  return <PageView page={data} onChange={() => void 0} />;
};

// @ts-ignore next
export const PageView = ({ page, onChange }) => {
  return <div style={{ padding: "4px" }}></div>;
};
