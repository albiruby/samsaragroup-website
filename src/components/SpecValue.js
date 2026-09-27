import NumberCounter from "./NumberCounter";

export default function SpecValue({ value }) {
  if (typeof value !== "string") return value;
  const m = value.match(/^(\d[\d,.]*)\s+(.*)$/);
  if (!m) return value;
  const num = parseFloat(m[1].replace(/,/g, ""));
  if (Number.isNaN(num) || num <= 0) return value;
  return (
    <>
      <NumberCounter target={num} />
      {" " + m[2]}
    </>
  );
}
