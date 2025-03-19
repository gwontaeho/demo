import { forwardRef } from "react";
import { useControl } from "./useControl";
import { Text } from "./components/Text";
import { Number } from "./components/Number";
import { Textarea } from "./components/Textarea";
import { Select } from "./components/Select";
import { Radio } from "./components/Radio";
import { Checkbox } from "./components/Checkbox";

const Control = forwardRef((props, ref) => {
  const {
    type,
    message,
    errorMessage,
    editable = true,
    ...rest
  } = useControl(props);

  if (!editable) {
    const value = rest.value ?? rest.defaultValue;
    const text = Array.isArray(value) ? value.join(", ") : value;
    return <div>{text}</div>;
  }

  return (
    <div className="[&>*]:w-full">
      {type === "text" ? (
        <Text ref={ref} {...rest} />
      ) : type === "number" ? (
        <Number ref={ref} {...rest} />
      ) : type === "textarea" ? (
        <Textarea ref={ref} {...rest} />
      ) : type === "select" ? (
        <Select ref={ref} {...rest} />
      ) : type === "radio" ? (
        <Radio ref={ref} {...rest} />
      ) : type === "checkbox" ? (
        <Checkbox ref={ref} {...rest} />
      ) : null}

      {message && <div>{message}</div>}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
});

export { Control };
