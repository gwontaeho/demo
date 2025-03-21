import { forwardRef } from "react";

const Date = forwardRef((props, ref) => {
  const { onChange, ...rest } = props;
  return (
    <input
      ref={ref}
      type="date"
      className="border h-6 px-2 bg-slate-50"
      onChange={(event) => onChange?.(event.target.value)}
      {...rest}
    />
  );
});

export { Date };
