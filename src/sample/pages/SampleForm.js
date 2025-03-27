import { useEffect, useLayoutEffect, useState, useReducer } from "react";
import { Doc } from "../doc-template";
import { Form, useForm, useControl } from "../../module/form";
import { Control } from "../../module/control";

const options = [
  { label: "a", value: "a" },
  { label: "b", value: "b" },
];

const schema = {};

export const SampleForm = () => {
  const [values, setValues] = useState("");

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
    defaultSchema: schema,
  });

  const forceUpdate = useReducer(() => ({}))[1];
  const [show, setShow] = useState(true);

  const text = watch("text");
  const number = watch("number");

  return (
    <Doc>
      <Doc.H1>form</Doc.H1>

      <Doc.H2># useForm()</Doc.H2>

      <Doc.Item>
        <Doc.Desc>schema</Doc.Desc>
        <Doc.Code>{`const schema = {
  text: { label: "text", type: "text" },
  number: { label: "number", type: "number" },
};`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Desc>usage</Doc.Desc>
        <Doc.Code>{`const form = useForm({
  defaultSchema: schema,
});`}</Doc.Code>
      </Doc.Item>

      <Doc.H2># {`<Form />`}</Doc.H2>

      <Doc.Item>
        <Doc.Desc>control registration</Doc.Desc>
        <div className="flex flex-col flex-1">
          <Doc.Code>{`<Form>
  <Form.Control {...register("text")} />
  <Form.Control {...register("number")} />
  <Form.Control {...register("textarea")} />
  <Form.Control {...register("select")} options={options} />
  <Form.Control {...register("radio")} options={options} />
  <Form.Control {...register("checkbox")} options={options} />
  <Form.Control {...register("date")} />
  <Form.Control {...register("time")} />
</Form>`}</Doc.Code>
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
        </div>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button
          onClick={() => {
            console.log(getValues());
            setValues(getValues());
          }}
        >
          get all values
        </Doc.Button>
        <div className="flex flex-col flex-1">
          <Doc.Code>{`getValues()`}</Doc.Code>
          <div className="text-xs">{JSON.stringify(values)}</div>
        </div>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button onClick={() => setEditable(true)}>
          set editable "true"
        </Doc.Button>
        <Doc.Code>{`setEditable(true)`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button onClick={() => setEditable(false)}>
          set editable "false"
        </Doc.Button>
        <Doc.Code>{`setEditable(false)`}</Doc.Code>
      </Doc.Item>

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
        </div>
      </div>
    </Doc>
  );
};

const Test44 = () => {
  console.log("fff");
  return <div>22</div>;
};
