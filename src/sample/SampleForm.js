import { useEffect, useLayoutEffect, useState, useReducer } from "react";

import { Form, useForm, useControl } from "../module/form";
import { Control } from "../module/control";

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
    watch,
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
      date: { label: "date", type: "date" },
      time: { label: "time", type: "time" },
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

  const form = useForm({
    defaultSchema: {
      text: { label: "text", type: "text" },
      number: { label: "number", type: "number" },
    },
  });

  const forceUpdate = useReducer(() => ({}))[1];
  const [show, setShow] = useState(true);

  const text = watch("text");
  const number = watch("number");

  return (
    <div className="p-4">
      <Form>
        <Form.Control {...register("text")} />
        <Form.Control {...register("number")} />
        <Form.Control {...register("textarea")} />
        <Form.Control {...register("select")} options={options} />
        <Form.Control {...register("radio")} options={options} />
        <Form.Control {...register("checkbox")} options={options} />
        <Form.Control {...register("date")} />
        <Form.Control {...register("time")} />
      </Form>

      <div className="mt-4 text-sm border rounded divide-y [&>div]:flex [&>div]:p-4 [&>div>span]:w-80">
        <div>
          <span>define schema</span>
          <pre>{`const form = useForm({
  defaultSchema: {
    text: { label: "text", type: "text" },
    number: { label: "number", type: "number" },
  },
});`}</pre>
        </div>

        <div>
          <span>control registration</span>
          <pre>{`<Form.Control {...register("text")} />`}</pre>
        </div>
      </div>

      <div>
        <div className="mt-10 grid grid-cols-4 gap-4 [&>button]:p-1 [&>button]:text-left">
          <button onClick={TESTGET}>TESTGET</button>
          <button onClick={() => setShow((prev) => !prev)}>show</button>
          <button onClick={forceUpdate}>render</button>
          <div />
          <button onClick={() => resetValues()}>reset</button>
          <button onClick={() => clearValues()}>clear</button>
          <button onClick={validate}>validate</button>
          <button onClick={() => setValue("text", "asasfas")}>set text</button>
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
