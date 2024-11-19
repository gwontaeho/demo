export const SampleForm = () => {
  // console.log(useController);
  console.log("render");
  const a = useForm123();
  const b = useForm123();

  // console.log(a.control);
  // console.log(a.watch);
  // console.log(a.register("te").onChange);

  const {
    schema,
    watch,
    getValues,
    setValue,
    setEdit,
    validate,
    clearValues,
    clearErrors,
  } = useForm({
    defaultSchema: {
      text: { type: "text", label: "text", required: true },
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

  // const text = watch("text");
  // const select = watch("select");
  // const radio = watch("radio");
  // const checkbox = watch("checkbox");
  // console.log(checkbox);
  // console.log(radio);
  // console.log(text);
  // console.log(select);

  // console.log(schema);

  return (
    <form>
      <Form>
        <Form.Row>
          <Form.Control {...schema.date} />
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
      </Form>

      <Button onClick={() => clearErrors()}>clearErrors</Button>
      <Button onClick={() => clearValues()}>clearValues</Button>
      <Button onClick={() => setEdit("checkbox", false)}>set edit false</Button>
      <Button onClick={() => setEdit("checkbox", true)}>set edit true</Button>
      <Button onClick={validate}>validate</Button>
      <Button onClick={() => console.log(getValues())}>get values</Button>
    </form>
  );
};
