import { forwardRef } from "react";

export const ControlNumber = forwardRef((props, ref) => {
  const { onChange, thousandsSeparator, decimalScale, ...rest } = props;

  const handleChange = (event) => {
    event.target.value = event.target.value.replace(/[^0-9.]+/g, "");
    const lastPoint = event.target.value.lastIndexOf(".");

    if (lastPoint !== -1) {
      event.target.value =
        event.target.value.slice(0, lastPoint).replaceAll(".", "") +
        event.target.value.slice(lastPoint);
    }

    if (typeof decimalScale === "number") {
      const point = event.target.value.indexOf(".");
      if (point !== -1) {
        if (decimalScale === 0) {
          event.target.value = event.target.value.replaceAll(".", "");
        } else {
          event.target.value = event.target.value.slice(
            0,
            point + 1 + decimalScale
          );
        }
      }
    }

    if (thousandsSeparator === true) {
      const [integer, decimal] = event.target.value.split(".");
      event.target.value =
        integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        (decimal === undefined ? "" : `.${decimal}`);
    }

    onChange?.(event);
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
