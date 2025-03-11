import { forwardRef, useId } from "react";

export const ControlCheckbox = forwardRef((props, ref) => {
  const { options, value, defaultValue, ...rest } = props;
  const id = useId();

  return (
    <div className="flex gap-x-4 flex-wrap">
      {options?.map((item, index) => {
        return (
          <label key={id + index}>
            <input
              {...rest}
              ref={ref}
              type="checkbox"
              value={item.value}
              checked={value?.includes(item.value)}
              defaultChecked={defaultValue?.includes(item.value)}
            />
            {item.label}
          </label>
        );
      })}
    </div>
  );
});
