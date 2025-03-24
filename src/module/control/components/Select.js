import { forwardRef, useRef } from "react";

const Select = forwardRef((props, ref) => {
  const { options, onChange, ...rest } = props;
  const _key = useRef({ key: crypto.randomUUID() }).current;

  return (
    <select
      ref={ref}
      className="text-sm border h-6 bg-slate-50"
      onChange={(event) => onChange?.(event.target.value)}
      {...rest}
    >
      <option value=""></option>
      {options?.map((item, index) => {
        return (
          <option key={_key.key + ":" + index} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
});

export { Select };
