import { Control } from "./Control";
import { Button } from "./Button";

const COL_SPAN = {
  2: "col-span-2",
  4: "col-span-4",
  6: "col-span-6",
  8: "col-span-8",
  10: "col-span-10",
  12: "col-span-12",
};

const MIN_H = {
  1: "min-h-12",
  2: "min-h-24",
  3: "min-h-36",
  4: "min-h-48",
};

const DIRECTION = {
  row: "flex-row",
  col: "flex-col",
};

const BORDER_R = {
  false: "",
  true: " border-r",
};

const FormCell = (props) => {
  const { children, size = 4, grid } = props;
  return (
    <div
      className={
        (grid ? "grid grid-cols-subgrid" : "p-1 flex items-center flex-wrap") +
        " min-h-12" +
        ` ${COL_SPAN[size]}`
      }
    >
      {children}
    </div>
  );
};

const FormLabel = (props) => {
  const { children, size = 2, required } = props;
  return (
    <div
      className={
        "p-1 flex items-center min-h-12 bg-gray-100" +
        ` ${COL_SPAN[size]}` +
        (required ? " after:content-['*'] after:text-red-600" : "")
      }
    >
      {children}
    </div>
  );
};

const FormControl = (props) => {
  const {
    label,
    labelSize = label ? 2 : 0,
    controlSize = 4,
    required,
    ...rest
  } = props;
  return (
    <>
      {label && (
        <FormLabel size={labelSize} required={required}>
          {label}
        </FormLabel>
      )}
      <div
        className={
          "p-1 flex items-center min-h-12 [&>*]:w-full" +
          ` ${COL_SPAN[controlSize]}`
        }
      >
        <Control {...rest} />
      </div>
    </>
  );
};

const FormRow = (props) => {
  const { children } = props;
  return (
    <div className="grid grid-cols-subgrid col-span-12 min-h-12 border-b border-r [&>*:not(:last-child)]:border-r">
      {children}
    </div>
  );
};

export const Form = (props) => {
  const { children } = props;
  return <div className="grid grid-cols-12 border-l border-t">{children}</div>;
};

Form.Row = FormRow;
Form.Cell = FormCell;
Form.Label = FormLabel;
Form.Control = FormControl;
