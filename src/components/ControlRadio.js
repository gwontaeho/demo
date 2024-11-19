import { forwardRef, useId } from "react";

export const ControlRadio = forwardRef((props, ref) => {
  const { options, value, ...rest } = props;
  const id = useId();

  return (
    <div className="flex flex-wrap gap-x-4">
      {options?.map((item, index) => {
        return (
          <label key={id + index}>
            <input
              {...rest}
              ref={ref}
              type="radio"
              value={item.value}
              checked={value === item.value}
            />
            {item.label}
          </label>
        );
      })}
    </div>
  );
});
