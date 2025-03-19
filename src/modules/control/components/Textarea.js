import { forwardRef } from "react";

const Textarea = forwardRef((props, ref) => {
  const { onChange, ...rest } = props;
  return (
    <textarea
      ref={ref}
      className="block border min-h-6 px-2 bg-slate-50"
      onChange={(event) => onChange?.(event.target.value)}
      {...rest}
    />
  );
});

export { Textarea };
