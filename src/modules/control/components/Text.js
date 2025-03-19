import { forwardRef } from "react";

const Text = forwardRef((props, ref) => {
  const { onChange, ...rest } = props;
  return (
    <input
      ref={ref}
      type="text"
      className="border h-6 px-2 bg-slate-50"
      autoComplete="off"
      onChange={(event) => onChange?.(event.target.value)}
      {...rest}
    />
  );
});

export { Text };
