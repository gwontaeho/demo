import { useGridContext } from "../hooks/useGridContext";

const Sizer = (props) => {
  const { size, onChange } = props;
  const { getKeyBase } = useGridContext();
  const keyBase = getKeyBase();
  const list = [10, 20, 30, 40, 50, 100, 1000];
  const handleChange = (event) => {
    onChange?.(Number(event.target.value));
  };
  return (
    <select
      className="h-6 w-20 rounded border text-sm"
      value={size}
      onChange={handleChange}
    >
      {list.map((value) => {
        const key = `${keyBase}:s:${value}`;
        return (
          <option key={key} value={value}>
            {value}
          </option>
        );
      })}
    </select>
  );
};

export { Sizer };
