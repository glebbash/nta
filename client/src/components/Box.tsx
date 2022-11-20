import { createComponent } from "../utils/nta-core";

// @ts-ignore next
export const Box = ({ data: { content, align }, state }) => {
  const boxStyle = {
    display: "flex",
    ...(align === "vertical" && { flexDirection: "column" }),
  };

  return (
    // @ts-ignore next
    <div style={boxStyle}>
      {/* @ts-ignore next */}
      {content.map((item) => createComponent(item, state))}
    </div>
  );
};
