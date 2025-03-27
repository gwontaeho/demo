import { usePopup } from "../../module/popup";
import { Doc } from "../doc-template";

export const SamplePopup = () => {
  const { openPopup, closePopup, postMessageToOpener } = usePopup();

  return (
    <Doc>
      <Doc.H1>popup</Doc.H1>

      <Doc.H2># usePopup</Doc.H2>

      <Doc.H2># openPopup()</Doc.H2>

      <Doc.Item>
        <Doc.Button
          onClick={() => {
            openPopup({
              url: "http://localhost:8080",
            });
          }}
        >
          open popup
        </Doc.Button>
        <Doc.Code>
          {`openPopup({
  url: "http://localhost:8080",
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

      <Doc.H2># closePopup()</Doc.H2>
    </Doc>
  );
};
