import { forwardRef } from "react";
import { Control } from "../control";

const COL_SPAN = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const FormCell = (props) => {
  const { children, size = 4 } = props;
  return (
    <div
      className={
        "min-h-8 border-r border-b" + (size ? ` ${COL_SPAN[size]}` : "")
      }
    >
      {children}
    </div>
  );
};

const FormCells = (props) => {
  const { children, size = 4 } = props;
  return (
    <div
      className={
        "min-h-8 grid grid-cols-subgrid" + (size ? ` ${COL_SPAN[size]}` : "")
      }
    >
      {children}
    </div>
  );
};

const FormLabel = (props) => {
  const { label, size = 2, required } = props;
  return (
    <div
      className={
        "p-1 flex items-center min-h-8 border-r border-b bg-gray-100" +
        (size ? ` ${COL_SPAN[size]}` : "") +
        (required ? " after:content-['*'] after:text-red-600" : "")
      }
    >
      {label}
    </div>
  );
};

const FormControl = forwardRef((props, ref) => {
  const { label, labelSize = 2, controlSize = 4, required, ...rest } = props;

  return (
    <>
      {label && (
        <FormLabel label={label} size={labelSize} required={required} />
      )}
      <div
        className={
          "p-1 flex items-center min-h-8 border-r border-b [&>*]:w-full" +
          (controlSize ? ` ${COL_SPAN[controlSize]}` : "")
        }
      >
        <Control ref={ref} {...rest} />
      </div>
    </>
  );
});

// const FormRow = (props) => {
//   const { children } = props;
//   return (
//     <div className="grid grid-cols-subgrid col-span-12 min-h-8">{children}</div>
//   );
// };

const Form = (props) => {
  const { children } = props;
  return <div className="grid grid-cols-12 border-l border-t">{children}</div>;
};

// Form.Row = FormRow;
Form.Cell = FormCell;
Form.Cells = FormCells;
Form.Label = FormLabel;
Form.Control = FormControl;

export { Form };
