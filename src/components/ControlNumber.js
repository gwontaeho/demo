import { forwardRef } from "react";

export const ControlNumber = forwardRef((props, ref) => {
  const { onChange, thousandsSeparator, decimalScale, ...rest } = props;

  const handleChange = (event) => {
    if (!isNaN(event.target.value.replaceAll(",", ""))) {
      if (event.target.value === "") {
      } else {
        const splitted = event.target.value.replaceAll(",", "").split(".");
        let integer = splitted[0];
        let decimal = splitted[1];
        if (thousandsSeparator) {
          integer = Number(integer).toLocaleString();
        }
        if (decimal === undefined) {
          decimal = "";
        } else if (decimalScale === undefined) {
          decimal = `.${decimal}`;
        } else if (decimalScale) {
          decimal = `.${decimal.slice(0, decimalScale)}`;
        }
        event.target.value = integer + decimal;
      }
      onChange?.(event);
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      autoComplete="off"
      className="border h-8 px-2 bg-slate-50"
      onChange={handleChange}
      {...rest}
    />
  );
});
