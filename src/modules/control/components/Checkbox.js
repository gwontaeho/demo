import { forwardRef, useRef } from "react";

const Checkbox = forwardRef((props, ref) => {
  const { value, defaultValue, options, name, onChange } = props;
  const _ = useRef({
    key: crypto.randomUUID(),
    handleChange: (event) => {
      const inputs =
        event.target.parentElement.parentElement.getElementsByTagName("input");
      onChange?.(
        [...inputs]
          .filter((element) => element.checked)
          .map((element) => element.value)
      );
    },
  }).current;

  return (
    <div className="flex gap-x-4 flex-wrap">
      {options?.map((item, index) => {
        const checked = Array.isArray(value)
          ? value.includes(item.value)
          : undefined;
        const defaultChecked = Array.isArray(defaultValue)
          ? defaultValue.includes(item.value)
          : undefined;
        return (
          <label key={_.key + ":" + index}>
            <input
              ref={ref}
              type="checkbox"
              name={name}
              value={item.value}
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={_.handleChange}
            />
            {item.label}
          </label>
        );
      })}
    </div>
  );
});

export { Checkbox };
