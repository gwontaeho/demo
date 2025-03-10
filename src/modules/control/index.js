import { forwardRef, useRef } from "react";
import { useControl } from "../form";

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const ControlText = forwardRef((props, ref) => {
  const { ...rest } = props;
  return (
    <input
      ref={ref}
      type="text"
      className="border h-8 px-2 bg-slate-50"
      autoComplete="off"
      {...rest}
    />
  );
});

const ControlNumber = forwardRef((props, ref) => {
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

const ControlTextarea = forwardRef((props, ref) => {
  const { ...rest } = props;
  return (
    <textarea
      ref={ref}
      className="block border min-h-8 px-2 bg-slate-50"
      {...rest}
    />
  );
});

const ControlSelect = forwardRef((props, ref) => {
  const { options, onChange } = props;
  const _key = useRef({ key: uuid() }).current;
  return (
    <select ref={ref} className="border h-8 bg-slate-50" onChange={onChange}>
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

const ControlRadio = forwardRef((props, ref) => {
  const { value, options, name, onChange } = props;
  const _key = useRef({ key: uuid() }).current;
  return (
    <div className="flex flex-wrap gap-x-4">
      {options?.map((item, index) => {
        return (
          <label key={_key.key + ":" + index}>
            <input
              ref={ref}
              type="radio"
              name={name}
              value={item.value}
              checked={value === item.value}
              onChange={onChange}
            />
            {item.label}
          </label>
        );
      })}
    </div>
  );
});

const ControlCheckbox = forwardRef((props, ref) => {
  const { value, options, name, onChange } = props;
  const _key = useRef({ key: uuid() }).current;
  return (
    <div className="flex gap-x-4 flex-wrap">
      {options?.map((item, index) => {
        return (
          <label key={_key.key + ":" + index}>
            <input
              ref={ref}
              type="checkbox"
              name={name}
              value={item.value}
              checked={value.includes(item.value)}
              onChange={onChange}
            />
            {item.label}
          </label>
        );
      })}
    </div>
  );
});

const Control = forwardRef((props, ref) => {
  const {
    type,
    message,
    errorMessage,
    editable = true,
    ...rest
  } = useControl(props);

  if (!editable) {
    const value = rest.value;
    const text = type === "checkbox" ? value.join(", ") : value;
    return <div>{text}</div>;
  }

  return (
    <div>
      {type === "text" ? (
        <ControlText ref={ref} {...rest} />
      ) : type === "number" ? (
        <ControlNumber ref={ref} {...rest} />
      ) : type === "textarea" ? (
        <ControlTextarea ref={ref} {...rest} />
      ) : type === "select" ? (
        <ControlSelect ref={ref} {...rest} />
      ) : type === "radio" ? (
        <ControlRadio ref={ref} {...rest} />
      ) : type === "checkbox" ? (
        <ControlCheckbox ref={ref} {...rest} />
      ) : null}

      {message && <div>{message}</div>}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
});

export { Control };
