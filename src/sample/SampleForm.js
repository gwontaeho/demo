import { useEffect, useLayoutEffect, useState, useReducer } from "react";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { useForm } from "../modules/form";
import { Control } from "../modules/control";

const options = [
  { label: "a", value: "a" },
  { label: "b", value: "b" },
];

export const SampleForm = () => {
  console.log("render");

  const {
    register,
    setValue,
    setSchema,
    setFocus,
    getValues,
    getValue,
    getErrors,
    validate,
  } = useForm({
    defaultSchema: {
      text: { type: "text", required: true },
      number: { type: "number" },
      textarea: { type: "textarea" },
      select: { type: "select" },
      radio: { type: "radio" },
      checkbox: { type: "checkbox" },
    },
  });

  const forceUpdate = useReducer(() => ({}))[1];

  return (
    <div>
      <Control {...register("text")} />
      <Control {...register("number")} />
      <Control {...register("textarea")} />
      <Control {...register("select")} options={options} />
      <Control {...register("radio")} options={options} />
      <Control {...register("checkbox")} options={options} />

      <div className="grid grid-cols-4 gap-4">
        <button onClick={forceUpdate}>render</button>

        <button onClick={validate}>validate</button>

        <button onClick={() => setValue("checkbox", ["a", "b"])}>
          set value text
        </button>

        <button onClick={() => setFocus("text")}>focusText</button>

        <button
          onClick={() =>
            setSchema("text", (prev) => {
              console.log(prev);
              return { ...prev, type: "number" };
            })
          }
        >
          setSchema
        </button>

        <button
          onClick={() =>
            setSchema("text", (prev) => {
              console.log(prev);
              return { ...prev, type: "text" };
            })
          }
        >
          setSchema2
        </button>
      </div>
    </div>
  );
};
