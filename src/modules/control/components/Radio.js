import { forwardRef, useRef } from "react";

const Radio = forwardRef((props, ref) => {
  const { value, defaultValue, options, name, onChange } = props;
  const _ = useRef({ key: crypto.randomUUID() }).current;

  return (
    <div className="flex flex-wrap gap-x-4">
      {options?.map((item, index) => {
        const checked = value === undefined ? undefined : value === item.value;
        const defaultChecked =
          defaultValue === undefined ? undefined : defaultValue === item.value;
        return (
          <label key={_.key + ":" + index}>
            <input
              ref={ref}
              type="radio"
              name={name ?? _.key}
              value={item.value}
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={(event) => onChange?.(event.target.value)}
            />
            {item.label}
          </label>
        );
      })}
    </div>
  );
});

export { Radio };
