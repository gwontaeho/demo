import { forwardRef, useRef } from "react";
import { useControl } from "../form";

const ControlText = forwardRef((props, ref) => {
  const { onChange, ...rest } = props;
  return (
    <input
      ref={ref}
      type="text"
      className="border h-6 px-2 bg-slate-50"
      autoComplete="off"
      onChange={(event) => onChange?.(event.target.value)}
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
    onChange?.(event.target.value);
  };

  return (
    <input
      ref={ref}
      type="text"
      autoComplete="off"
      className="border h-6 px-2 bg-slate-50"
      onChange={handleChange}
      {...rest}
    />
  );
});

const ControlTextarea = forwardRef((props, ref) => {
  const { onChange, ...rest } = props;
  return (
    <textarea
      ref={ref}
      className="block border min-h-6 px-2 bg-slate-50"
      onChange={(event) => onChange?.(event.target.value)}
      {...rest}
    />
  );
});

const ControlSelect = forwardRef((props, ref) => {
  const { options, onChange } = props;
  const _key = useRef({ key: crypto.randomUUID() }).current;
  return (
    <select
      ref={ref}
      className="border h-6 bg-slate-50"
      onChange={(event) => onChange?.(event.target.value)}
    >
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
  const { value, defaultValue, options, name, onChange } = props;
  const _ = useRef({ key: crypto.randomUUID() }).current;
  return (
    <div className="flex flex-wrap gap-x-4">
      {options?.map((item, index) => {
        return (
          <label key={_.key + ":" + index}>
            <input
              ref={ref}
              type="radio"
              name={name ?? _.key}
              value={item.value}
              defaultChecked={
                defaultValue === undefined
                  ? undefined
                  : defaultValue === item.value
              }
              checked={value === undefined ? undefined : value === item.value}
              onChange={(event) => onChange?.(event.target.value)}
            />
            {item.label}
          </label>
        );
      })}
    </div>
  );
});

const ControlCheckbox = forwardRef((props, ref) => {
  const { value, defaultValue, options, name, onChange } = props;
  const _ = useRef({ key: crypto.randomUUID() }).current;

  return (
    <div className="flex gap-x-4 flex-wrap">
      {options?.map((item, index) => {
        return (
          <label key={_.key + ":" + index}>
            <input
              ref={ref}
              type="checkbox"
              name={name}
              value={item.value}
              defaultChecked={defaultValue?.includes?.(item.value)}
              checked={value?.includes?.(item.value)}
              onChange={(event) =>
                onChange?.(
                  [
                    ...event.target.parentElement.parentElement.getElementsByTagName(
                      "input"
                    ),
                  ]
                    .filter((element) => element.checked)
                    .map((element) => element.value)
                )
              }
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
    const value = rest.value || rest.defaultValue;
    const text = type === "checkbox" ? value.join(", ") : value;
    return <div>{text}</div>;
  }

  return (
    <div className="[&>*]:w-full">
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
