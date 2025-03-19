import { forwardRef, useRef } from "react";

const c = (value) => {
  value = value.replace(/[^0-9.]+/g, "").replace(/(\..*?)\./g, "$1");
  if (value.startsWith(".")) {
    value = "0" + value;
  }
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
    beforeValue: value === undefined ? value : String(value),
  }).current;

  const handleChange = (event) => {
    const rawValue = event.target.value;
    const rawSelectionStart = event.target.selectionStart;
    const rawValueNumberCount = rawValue.replace(/[^0-9]+/g, "").length;
    const rawBeforeSelection = rawValue.slice(0, rawSelectionStart);
    const rawBeforeSelectionNumberCount = rawBeforeSelection.replace(
      /[^0-9]+/g,
      ""
    ).length;

    const isLastCharDot = rawValue.slice(-1);

    const beforeValue = data.beforeValue;
    const beforeValueNumberCount = beforeValue.replace(/[^0-9]+/g, "").length;

    if (rawValueNumberCount === beforeValueNumberCount) {
      if (event.nativeEvent.inputType === "deleteContentBackward") {
        event.target.value =
          value.slice(0, rawSelectionStart - 1) +
          value.slice(rawSelectionStart + 1);
      }

      if (event.nativeEvent.inputType === "deleteContentForward") {
        event.target.value =
          value.slice(0, rawSelectionStart) +
          value.slice(rawSelectionStart + 2);
      }
    }

    event.target.value = c(event.target.value);
    if (hasDecimalScale) event.target.value = d(event.target.value);
    if (hasSeparator) event.target.value = s(event.target.value);

    let newPosition;
    let count = 0;
    for (let i = 0; i < event.target.value.length; i++) {
      if (/\d/.test(event.target.value[i])) {
        count++;
        if (count === rawBeforeSelectionNumberCount) {
          newPosition = i + 1;
          break;
        }
      }
    }
    if (isLastCharDot) {
      newPosition += 1;
    }
    console.log(count);

    console.log(newPosition);

    event.target.setSelectionRange(newPosition, newPosition);

    // event.target.value = c(event.target.value);
    // if (hasDecimalScale) {
    //   event.target.value = d(event.target.value, decimalScale);
    // }
    // if (hasSeparator) {
    //   event.target.value = s(event.target.value);
    // }

    // const value = event.target.value;
    // const valueNumberCount = value.replace(/[^0-9]+/g, "").length;

    // console.log(rawValue, value);
    // console.log(rawValueNumberCount, valueNumberCount);

    // const selectionStart2 = event.target.selectionStart;

    // const beforeSelection = event.target.value.slice(0, selectionStart);

    // console.log(selectionStart, selectionStart2);

    // console.log(rawValueNumberCount === )

    // console.log(rawValue.slice(selectionStart, 1));
    // console.log(rawValue, event.target.value);

    // console.log(selectionStart);
    // console.log(beforeSelection);

    // const isLastCharDot = beforeSelection.slice(-1);
    // const numberCountBeforeSelection = beforeSelection.replace(
    //   /[^0-9]+/g,
    //   ""
    // ).length;

    // console.log(beforeSelection);

    // const deletedChar =
    //   event.nativeEvent?.inputType === "deleteContentBackward"
    //     ? beforeSelection.slice(-1)
    //     : event.nativeEvent?.inputType === "deleteContentForward"
    //     ? event.target.value[selectionStart]
    //     : null;

    // console.log(deletedChar);

    // let newPosition;
    // let count = 0;
    // for (let i = 0; i < event.target.value.length; i++) {
    //   if (/\d/.test(event.target.value[i])) {
    //     count++;
    //     if (count === numberCountBeforeSelection) {
    //       newPosition = i + 1;
    //       break;
    //     }
    //   }
    // }
    // if (isLastCharDot) {
    //   newPosition += 1;
    // }

    // console.log(newPosition);

    // console.log(event.target.value);

    // const newLength = newValue.length;
    // const offset = newLength - rawLength;
    // const newPosition = Math.max(0, selectionStart + offset);

    // event.target.setSelectionRange(rawSelectionStart, rawSelectionStart);

    data.beforeValue = event.target.value;
    onChange?.(event.target.value);
  };

  //   let formattedValue = value;
  //   if (value !== undefined) {
  //     formattedValue = c(String(formattedValue));
  //     if (hasDecimalScale) {
  //       formattedValue = d(formattedValue, decimalScale);
  //     }
  //     if (hasSeparator) {
  //       formattedValue = s(formattedValue);
  //     }
  //   }

  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      className="border h-6 px-2 bg-slate-50"
      onChange={handleChange}
      value={value}
      {...rest}
    />
  );
});

export { Number };
