import { forwardRef } from "react";
import { useControl } from "./useControl";
import { Text } from "./components/Text";
import { Number } from "./components/Number";
import { Textarea } from "./components/Textarea";
import { Select } from "./components/Select";
import { Radio } from "./components/Radio";
import { Checkbox } from "./components/Checkbox";
import { Password } from "./components/Password";
import { Icon } from "../icon";

const Control = forwardRef((props, ref) => {
  const {
    type,
    message,
    errorMessage,
    editable = true,
    button,
    onLeftButtonClick,
    onRightButtonClick,
    ...rest
  } = useControl(props);

  if (!editable) {
    const value = rest.value ?? rest.defaultValue;
    const text = Array.isArray(value) ? value.join(", ") : value;
    return <div>{text}</div>;
  }

  return (
    <div className="[&>*]:w-full">
      <div className="flex [&>input]:flex-1 [&>textarea]:flex-1 [&>select]:flex-1 [&>div]:flex-1">
        {button === "left" && (
          <button
            type="button"
            className="border-y border-l w-6 relative flex items-center justify-center [&>*]:absolute"
            onClick={onLeftButtonClick}
          >
            <Icon name="search" />
          </button>
        )}
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
        ) : type === "password" ? (
          <Password ref={ref} {...rest} />
        ) : null}
        {button === "right" && (
          <button
            type="button"
            className="border-y border-r w-6 relative flex items-center justify-center [&>*]:absolute"
            onClick={onRightButtonClick}
          >
            <Icon name="search" />
          </button>
        )}
      </div>

      {message && <div>{message}</div>}
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
});

export { Control };
