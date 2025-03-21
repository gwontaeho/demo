import { forwardRef, useRef } from "react";

const extractNumbers = (value) => {
  value = value.replace(/[^0-9.]+/g, "").replace(/(\..*?)\./g, "$1");
  return value;
};

const limitDecimalPoints = (value, scale) => {
  const index = value.indexOf(".");
  if (index === -1) return value;
  if (scale === 0) return value.replaceAll(".", "");
  return value.slice(0, index + 1 + scale);
};

const separateThousands = (value) => {
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
    previousValue: value === undefined ? "" : String(value),
  }).current;

  const handleChange = (event) => {
    const previousValue = data.previousValue;
    const previousValueNumberCount = previousValue.replace(
      /[^0-9]+/g,
      ""
    ).length;

    const isDotInputted = event.nativeEvent.data === ".";
    const inputType = event.nativeEvent.inputType;
    const rawValue = event.target.value;
    const rawSelectionStart = event.target.selectionStart;
    const rawValueNumberCount = rawValue.replace(/[^0-9]+/g, "").length;
    const rawBeforeSelection = rawValue.slice(0, rawSelectionStart);
    let rawBeforeSelectionNumberCount = rawBeforeSelection.replace(
      /[^0-9]+/g,
      ""
    ).length;

    let isAfterDotDeleted = false;
    if (
      rawValue[rawSelectionStart - 1] === "." &&
      (inputType === "deleteContentBackward" ||
        inputType === "deleteContentForward")
    ) {
      isAfterDotDeleted = true;
    }

    // Adjust separator deletion
    let deletionAdjust = 0;
    if (rawValueNumberCount === previousValueNumberCount) {
      const rawValueSeparatorCount = rawValue.replace(/[^,]+/g, "").length;
      const previousValueSeparatorCount = previousValue.replace(
        /[^,]+/g,
        ""
      ).length;
      if (previousValueSeparatorCount - rawValueSeparatorCount === 1) {
        if (inputType === "deleteContentBackward") {
          event.target.value =
            value.slice(0, rawSelectionStart - 1) +
            value.slice(rawSelectionStart + 1);
          deletionAdjust = -1;
        }
        if (inputType === "deleteContentForward") {
          event.target.value =
            value.slice(0, rawSelectionStart) +
            value.slice(rawSelectionStart + 2);
        }
      }
    }
    rawBeforeSelectionNumberCount += deletionAdjust;

    // Format
    event.target.value = extractNumbers(event.target.value);
    if (hasDecimalScale) {
      event.target.value = limitDecimalPoints(event.target.value, decimalScale);
    }
    if (hasSeparator) {
      event.target.value = separateThousands(event.target.value);
    }

    const formattedValue = event.target.value;
    const formattedSelectionStart = event.target.selectionStart;
    const formattedBeforeSelection = formattedValue.slice(
      0,
      formattedSelectionStart
    );
    const formattedBeforeNumberCount = formattedBeforeSelection.replace(
      /[^0-9]+/g,
      ""
    ).length;

    let isLimited = false;
    if (rawBeforeSelectionNumberCount > formattedBeforeNumberCount) {
      isLimited = true;
    }

    // Readjust selection
    let newPosition = 0;
    if (isLimited) {
      newPosition = formattedSelectionStart;
    } else {
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
      if (isDotInputted) {
        newPosition += 1;
      }
      if (isAfterDotDeleted) {
        newPosition += 1;
      }
    }

    event.target.setSelectionRange(newPosition, newPosition);
    data.previousValue = event.target.value;
    onChange?.(event.target.value);
  };

  let formattedValue = value;
  if (value !== undefined) {
    formattedValue = extractNumbers(String(formattedValue));
    if (hasDecimalScale) {
      formattedValue = limitDecimalPoints(formattedValue, decimalScale);
    }
    if (hasSeparator) {
      formattedValue = separateThousands(formattedValue);
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
