import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { useForm } from "../hooks/useForm";

export const SampleForm = () => {
  console.log("render");

  const {
    schema,
    setFocus,
    watchValue,
    watchSchema,
    watchError,
    getValues,
    setValue,
    setEdit,
    validate,
    clearValues,
    clearErrors,
    setSchema,
    setSchemas,
    getSchema,
    getSchemas,
  } = useForm({
    defaultSchema: {
      text: {
        type: "text",
        label: "text",
        required: true,
        minLength: 3,
        defaultValue: "44",
      },
      text2: { type: "text", label: "text2" },
      text3: { type: "text", label: "text3" },
      text4: { type: "text", label: "text4" },
      text5: { type: "text", label: "text5" },
      text6: { type: "text", label: "text6" },
      number: { type: "number", label: "number", thousandsSeparator: true },
      number2: { type: "number", label: "number2", decimalScale: 1 },
      date: { type: "date", label: "date" },

      select: {
        type: "select",
        label: "text",
        required: true,

        options: [
          { value: "a", label: "a" },
          { value: "b", label: "b" },
          { value: "c,", label: "c" },
          { value: "d", label: "d" },
        ],
      },
      radio: {
        required: true,
        type: "radio",
        label: "text",

        // defaultValue: "b",
        options: [
          { value: "a", label: "a" },
          { value: "b", label: "b" },
          { value: "c,", label: "c" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
        ],
      },
      textarea: {
        type: "textarea",
        required: true,
      },
      checkbox: {
        required: true,
        type: "checkbox",
        label: "text",
        // defaultValue: ["d"],
        options: [
          { value: "a", label: "a" },
          { value: "b", label: "b" },
          { value: "c", label: "c" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
          { value: "d", label: "d" },
        ],
      },
    },
  });

  const [test, setTest] = useState(0);

  const text = watchValue("text");
  // const textSchema = watchSchema("checkbox");
  // console.log(textSchema);

  useLayoutEffect(() => {
    // setSchemas({ text: { required: false } });
    setSchema("text", { label: "qwewqew" });
  }, []);

  const textError = watchError("text");
  console.log(textError);

  return (
    <form>
      <Form>
        <Form.Row>
          <Form.Control
            {...schema.date}
            renderer={(value, edit) => {
              console.log(value, edit);
              return "qwe";
            }}
          />
        </Form.Row>

        <Form.Row>
          <Form.Control {...schema.text} />
          <Form.Control {...schema.text2} />
        </Form.Row>

        <Form.Row>
          <Form.Control {...schema.number} />
          <Form.Control {...schema.number2} />
        </Form.Row>

        <Form.Row>
          <Form.Control {...schema.select} />
        </Form.Row>
        <Form.Row>
          <Form.Control {...schema.radio} />
          <Form.Control {...schema.checkbox} />
        </Form.Row>
        <Form.Row>
          <Form.Control {...schema.textarea} />
        </Form.Row>

        <Form.Row>qwd</Form.Row>

        <Form.Row>
          <Form.Cell grid>
            <Form.Cell size={1}>d112e1 12e12 2 j12e 2j1</Form.Cell>
            <Form.Cell size={1}>1</Form.Cell>
            <Form.Cell size={1}>1</Form.Cell>
            <Form.Cell size={1}>1</Form.Cell>
            <Form.Cell size={1}>1</Form.Cell>
            <Form.Cell size={1}>1</Form.Cell>
            <Form.Cell size={1}>1</Form.Cell>
            <Form.Cell size={1}>1</Form.Cell>
          </Form.Cell>
        </Form.Row>
      </Form>

      <Button
        onClick={() =>
          setValue("text", (prev) => {
            console.log(prev);
            return "asd";
          })
        }
      >
        set text '123'
      </Button>
      <Button onClick={() => clearErrors()}>clearErrors</Button>
      <Button onClick={() => clearValues()}>clearValues</Button>
      <Button onClick={() => setEdit(false)}>set edit all false</Button>
      <Button onClick={() => setEdit(true)}>set edit all true</Button>
      <Button onClick={() => setEdit("checkbox", false)}>set edit false</Button>
      <Button onClick={() => setEdit("checkbox", true)}>set edit true</Button>
      <Button onClick={() => console.log(validate())}>validate</Button>
      <Button onClick={() => console.log(getValues())}>get values</Button>
      <Button
        onClick={() => {
          setSchema("checkbox", (prev) => {
            return { ...prev, type: "text" };
          });
        }}
      >
        set schema
      </Button>

      <Button
        onClick={() => {
          setSchemas({
            text: { type: "number" },
            date: { type: "text" },
            checkbox: { type: "date" },
          });
        }}
      >
        set schemas
      </Button>
      <Button onClick={() => setTest((prev) => ++prev)}>render sample</Button>
      <Button onClick={() => setFocus("select")}>set focus</Button>
    </form>
  );
};
