import { usePopup } from "../../module/popup";
import { Doc } from "../doc-template";

export const SamplePopup = () => {
  const { openPopup, closePopup, postMessageToOpener } = usePopup();

  return (
    <Doc>
      <Doc.H1>popup</Doc.H1>

      <Doc.H2># usePopup</Doc.H2>

      <Doc.H3>openPopup()</Doc.H3>

      <Doc.Item>
        <Doc.Button
          onClick={() => {
            openPopup({
              url: "http://localhost:8080/docs/popup",
            });
          }}
        >
          open popup
        </Doc.Button>
        <Doc.Code>
          {`openPopup({
  url: "http://localhost:8080/docs/popup",
})`}
        </Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button
          onClick={() => {
            openPopup({
              id: "test",
              url: "http://localhost:8080/docs/popup",
            });
          }}
        >
          open popup with id
        </Doc.Button>
        <Doc.Code>
          {`openPopup({
  id: "test",
  url: "http://localhost:8080/docs/popup",
})`}
        </Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button
          onClick={() => {
            openPopup({
              url: "http://localhost:8080/docs/popup",
              onMessage: (data) => {
                console.log(data);
              },
            });
          }}
        >
          open popup with callback
        </Doc.Button>
        <Doc.Code>
          {`openPopup({
  url: "http://localhost:8080/docs/popup",
  onMessage: (data) => {
    console.log(data);
  },
})`}
        </Doc.Code>
      </Doc.Item>

      <Doc.H3>closePopup()</Doc.H3>

      <Doc.Item>
        <Doc.Button
          onClick={() => {
            closePopup("test");
          }}
        >
          close popup with id
        </Doc.Button>
        <Doc.Code>{`closePopup("test")`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button
          onClick={() => {
            closePopup();
          }}
        >
          close all popup
        </Doc.Button>
        <Doc.Code>{`closePopup()`}</Doc.Code>
      </Doc.Item>

      <Doc.H3>postMessageToOpener()</Doc.H3>

      <Doc.Item>
        <Doc.Button
          onClick={() => {
            postMessageToOpener({
              data1: "1",
              data2: [],
              data3: {},
            });
          }}
        >
          post message
        </Doc.Button>
        <Doc.Code>
          {`postMessageToOpener({
  data1: "1",
  data2: [],
  data3: {},
})`}
        </Doc.Code>
      </Doc.Item>
    </Doc>
  );
};
