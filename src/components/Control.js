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

  const controlValue = rest.value;
  const controlText =
    type === "date" && controlValue instanceof Date
      ? `${controlValue.getFullYear()}-${
          controlValue.getMonth() + 1 > 9 ? "" : "0"
        }${controlValue.getMonth() + 1}-${
          controlValue.getDate() > 9 ? "" : "0"
        }${controlValue.getDate()}`
      : type === "checkbox" && Array.isArray(controlValue)
      ? controlValue.join(", ")
      : controlValue;

  const rendererComponent =
    renderer instanceof Function &&
    renderer({
      value: controlValue,
      text: controlText,
      edit,
    });

  if (rendererComponent) {
    return rendererComponent;
  }

  if (edit === false) {
    return <div>{controlText}</div>;
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
