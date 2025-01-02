import { ControlText } from "./ControlText";
import { ControlNumber } from "./ControlNumber";
import { ControlRadio } from "./ControlRadio";
import { ControlCheckbox } from "./ControlCheckbox";
import { ControlSelect } from "./ControlSelect";
import { ControlTextarea } from "./ControlTextarea";
import { ControlDate } from "./ControlDate";
import { useControl } from "../hooks/useForm";

export const Control = (props) => {
  const { edit, type, error, renderer, ...rest } = useControl(props);

  const rendererComponent = renderer?.(rest.value, edit);

  if (rendererComponent !== undefined) {
    return rendererComponent;
  }

  if (edit === false) {
    let value = rest.value;
    if (type === "date") {
      if (value instanceof Date) {
        value = `${value.getFullYear()}-${value.getMonth() + 1 > 9 ? "" : "0"}${
          value.getMonth() + 1
        }-${value.getDate() > 9 ? "" : "0"}${value.getDate()}`;
      }
    } else if (type === "checkbox") {
      if (Array.isArray(value)) {
        value = value.join(", ");
      }
    }
    return <div>{value}</div>;
  }

  return (
    <div
      className={
        "[&>*]:w-full" +
        (error
          ? " [&_input]:border-red-600 [&_select]:border-red-600 [&_textarea]:border-red-600"
          : "")
      }
    >
      {type === "text" ? (
        <ControlText {...rest} />
      ) : type === "number" ? (
        <ControlNumber {...rest} />
      ) : type === "select" ? (
        <ControlSelect {...rest} />
      ) : type === "radio" ? (
        <ControlRadio {...rest} />
      ) : type === "checkbox" ? (
        <ControlCheckbox {...rest} />
      ) : type === "textarea" ? (
        <ControlTextarea {...rest} />
      ) : type === "date" ? (
        <ControlDate {...rest} />
      ) : null}
      {error && (
        <div className="text-xs text-red-600">
          {error[Object.keys(error)[0]].message}
        </div>
      )}
    </div>
  );
};
