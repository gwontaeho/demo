import { forwardRef, useId } from "react";

export const ControlSelect = forwardRef((props, ref) => {
  const { options, ...rest } = props;
  const id = useId();

  return (
    <select ref={ref} className="border h-8 bg-slate-50" {...rest}>
      <option value=""></option>
      {options?.map(({ value, label }, index) => {
        return (
          <option key={id + index} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
});
