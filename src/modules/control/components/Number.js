import { forwardRef, useRef } from "react";

const c = (value) => {
  value = value.replace(/[^0-9.]+/g, "").replace(/(\..*?)\./g, "$1");
  return value;
};

const d = (value, scale) => {
  const index = value.indexOf(".");
  if (index === -1) return value;
  if (scale === 0) return value.replaceAll(".", "");
  return value.slice(0, index + 1 + scale);
};

const s = (value) => {
  const [integer, decimal] = value.split(".");
  return (
    integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (decimal === undefined ? "" : `.${decimal}`)
  );
};

const Number = forwardRef((props, ref) => {
  const { onChange, thousandsSeparator, decimalScale, value, ...rest } = props;

  const hasDecimalScale = decimalScale !== undefined;
  const hasSeparator = thousandsSeparator !== undefined;

  const data = useRef({
    previousValue: value === undefined ? value : String(value),
  }).current;

  const handleChange = (event) => {
    const isDot = event.nativeEvent.data === ".";

    const rawValue = event.target.value;
    const rawSelectionStart = event.target.selectionStart;
    const rawValueNumberCount = rawValue.replace(/[^0-9]+/g, "").length;
    const rawBeforeSelection = rawValue.slice(0, rawSelectionStart);
    let rawBeforeSelectionNumberCount = rawBeforeSelection.replace(
      /[^0-9]+/g,
      ""
    ).length;

    const previousValue = data.previousValue;
    const previousValueNumberCount = previousValue.replace(
      /[^0-9]+/g,
      ""
    ).length;

    let isDeleted = false;
    if (rawValueNumberCount === previousValueNumberCount) {
      const rawValueSeparatorCount = rawValue.replace(/[^,]+/g, "").length;
      const previousValueSeparatorCount = previousValue.replace(
        /[^,]+/g,
        ""
      ).length;

      if (previousValueSeparatorCount - rawValueSeparatorCount === 1) {
        if (event.nativeEvent.inputType === "deleteContentBackward") {
          event.target.value =
            value.slice(0, rawSelectionStart - 1) +
            value.slice(rawSelectionStart + 1);
          isDeleted = true;
        }
        if (event.nativeEvent.inputType === "deleteContentForward") {
          event.target.value =
            value.slice(0, rawSelectionStart) +
            value.slice(rawSelectionStart + 2);
          isDeleted = true;
        }
      }
    }

    if (isDeleted) {
      rawBeforeSelectionNumberCount -= 1;
    }

    event.target.value = c(event.target.value);
    if (hasDecimalScale) event.target.value = d(event.target.value);
    if (hasSeparator) event.target.value = s(event.target.value);

    let newPosition = 0;
    let count = 0;
    for (let i = 0; i < event.target.value.length; i++) {
      if (/\d/.test(event.target.value[i])) {
        count++;
        if (count === rawBeforeSelectionNumberCount) {
          newPosition = i;
          break;
        }
      }
    }
    if (rawBeforeSelectionNumberCount !== 0) {
      newPosition += 1;
    }
    if (isDot) {
      newPosition += 1;
    }

    event.target.setSelectionRange(newPosition, newPosition);

    data.previousValue = event.target.value;
    onChange?.(event.target.value);
  };

  let formattedValue = value;
  if (value !== undefined) {
    formattedValue = c(String(formattedValue));
    if (hasDecimalScale) {
      formattedValue = d(formattedValue, decimalScale);
    }
    if (hasSeparator) {
      formattedValue = s(formattedValue);
    }
  }

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      className="border h-6 px-2 bg-slate-50"
      onChange={handleChange}
      value={formattedValue}
      {...rest}
    />
  );
});

export { Number };
