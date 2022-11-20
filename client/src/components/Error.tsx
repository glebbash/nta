// @ts-ignore next
export const Error = ({ data: { message } }) => {
  return (
    <p style={{ color: "red" }}>
      <b>Error:</b>
      {message}
    </p>
  );
};
