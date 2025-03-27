import { useToast } from "../../module/toast";
import { Doc } from "../doc-template";

export const SampleToast = () => {
  const { openToast, closeToast } = useToast();

  return (
    <Doc>
      <Doc.H1>useToast()</Doc.H1>

      <Doc.Item>
        <Doc.Desc>usage</Doc.Desc>
        <Doc.Code>{`const { openToast, closeToast } = useToast();`}</Doc.Code>
      </Doc.Item>

      <Doc.H2># openToast()</Doc.H2>

      <Doc.Item>
        <Doc.Button
          onClick={() =>
            openToast({
              content: <div>Test</div>,
            })
          }
        >
          open toast with content
        </Doc.Button>
        <Doc.Code>{`openToast({
  content: <div>Test</div>
})`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button
          onClick={() =>
            openToast({
              type: "success",
            })
          }
        >
          open toast with Type
        </Doc.Button>
        <Doc.Code>{`openToast({
  type: "success"
})`}</Doc.Code>
      </Doc.Item>

      <Doc.H2># closeToast()</Doc.H2>

      <Doc.Item>
        <Doc.Button onClick={() => closeToast()}>close all toast</Doc.Button>
        <Doc.Code>{`closeToast()`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button onClick={() => closeToast("test")}>
          close toast with id
        </Doc.Button>
        <Doc.Code>{`closeToast("test")`}</Doc.Code>
      </Doc.Item>
    </Doc>
  );
};
