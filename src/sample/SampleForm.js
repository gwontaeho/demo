import { useEffect, useLayoutEffect, useState, useReducer } from "react";

import { Form, useForm, useControl } from "../modules/form";
import { Control } from "../modules/control";

const options = [
  { label: "a", value: "a" },
  { label: "b", value: "b" },
];

export const SampleForm = () => {
  const {
    register,
    setValue,
    setFocus,
    getValues,
    getErrors,
    resetValues,
    clearValues,
    validate,
    setEditable,
    setSchema,
    getLabel,
    //
    TESTGET,
  } = useForm({
    defaultSchema: {
      text: { label: "text", type: "text", required: true },
      number: {
        label: "number",
        type: "number",
        thousandsSeparator: true,
        decimalScale: 2,
      },
      textarea: { label: "textarea", type: "textarea" },
      select: { label: "select", type: "select" },
      radio: { label: "radio", type: "radio" },
      checkbox: { label: "checkbox", type: "checkbox" },
    },
    defaultValues: {
      text: "a",
      number: 4,
      textarea: "bb",
      select: "b",
      radio: "a",
      checkbox: ["a", "b"],
    },
  });

  const forceUpdate = useReducer(() => ({}))[1];
  const [show, setShow] = useState(true);

  return (
    <div>
      {show && (
        <Form>
          <Form.Control {...register("text")} />
          <Form.Control {...register("number")} />

          <Form.Control {...register("textarea")} />
          <Form.Control {...register("select")} options={options} />

          <Form.Control {...register("radio")} options={options} />
          <Form.Control {...register("checkbox")} options={options} />

          <Form.Label {...getLabel("text")} />
          <Form.Cells>
            <Form.Control type="text" />
            <Form.Cell></Form.Cell>
          </Form.Cells>

          {/* <Form.Control {...register("checkbox")} options={options} /> */}
        </Form>
      )}

      <div>
        <div className="mt-10 grid grid-cols-4 gap-4 [&>button]:p-1 [&>button]:text-left">
          <button onClick={TESTGET}>TESTGET</button>
          <button onClick={() => setShow((prev) => !prev)}>show</button>
          <button onClick={forceUpdate}>render</button>
          <div />
          <button onClick={() => resetValues()}>reset</button>
          <button onClick={() => clearValues()}>clear</button>
          <button onClick={validate}>validate</button>
          <button onClick={() => setValue("checkbox", ["a", "b"])}>
            set checkbox
          </button>
          <button onClick={() => setFocus("text")}>focusText</button>
          <button onClick={() => console.log(getValues())}>get values</button>
          <button
            onClick={() =>
              setSchema("text", (prev) => {
                return { ...prev, type: "textarea" };
              })
            }
          >
            setSchema
          </button>
          <button
            onClick={() =>
              setSchema("text", (prev) => {
                return { ...prev, type: "text" };
              })
            }
          >
            setSchema2
          </button>
          <button onClick={() => setEditable(true)}>setEditable true</button>
          <button onClick={() => setEditable(false)}>setEditable false</button>
        </div>
      </div>
    </div>
  );
};

const Test44 = () => {
  console.log("fff");
  return <div>22</div>;
};
