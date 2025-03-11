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
    setSchema,
    setFocus,
    getValue,
    getError,
    validate,
    setEditable,
    getLabel,
    getSchema,
  } = useForm({
    defaultSchema: {
      text: { label: "asd", type: "text", required: true },
      number: { type: "number", thousandsSeparator: true },
      textarea: { type: "textarea" },
      select: { type: "select" },
      radio: { type: "radio" },
      checkbox: { type: "checkbox" },
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
      <Form>
        <Form.Row>
          {/* <Form.Label {...getLabel("text")} /> */}
          <Form.Control {...register("text")} />
          <Form.Control {...register("text")} />
          <Form.Cell></Form.Cell>
          <Form.Cell></Form.Cell>
        </Form.Row>
      </Form>

      <div>
        {/* {show && (
          <div>
            <Control {...register("text")} />
            <Control {...register("text")} />
            <Control {...register("text")} />
            <Control {...register("number")} />
            <Control {...register("textarea")} />
            <Control {...register("select")} options={options} />
            <Control {...register("radio")} options={options} />
            <Control {...register("checkbox")} options={options} />
          </div>
        )} */}

        <div className="mt-10 grid grid-cols-8 border-t border-l [&>button]:border-r [&>button]:border-b [&>button]:p-1">
          <button onClick={() => setShow((prev) => !prev)}>show</button>
          <button onClick={forceUpdate}>render</button>
          <button onClick={validate}>validate</button>
          <button onClick={() => setValue("checkbox", ["a", "b"])}>
            set checkbox
          </button>
          <button onClick={() => setFocus("text")}>focusText</button>
          <button onClick={() => console.log(getValue())}>get values</button>
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
