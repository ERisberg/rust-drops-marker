export const CONTAINER_STYLE = {
  padding: "1rem",
  display: "flex",
  gap: "1rem",
  alignItems: "center",
  minHeight: "200px",
  justifyContent: "stretch",
};

export function getStyleString(style: {}) {
  return Object.entries(style)
    .map(([k, v]) => {
      const newString = k
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase();
      return `${newString}:${v}`;
    })
    .join(";");
}
