import { forwardRef } from "react";

export const ControlTextarea = forwardRef((props, ref) => {
  const { ...rest } = props;
  return (
    <textarea
      ref={ref}
      className="block border min-h-8 px-2 bg-slate-50"
      {...rest}
    />
  );
});
