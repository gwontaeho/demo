import { forwardRef } from "react";

export const ControlText = forwardRef((props, ref) => {
  const { ...rest } = props;
  return (
    <input
      ref={ref}
      type="text"
      className="border h-8 px-2 bg-slate-50"
      autoComplete="off"
      {...rest}
    />
  );
});
