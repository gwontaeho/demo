import { useModal } from "../../module/modal";
import { Doc } from "../doc-template";

export const SampleModal = () => {
  const { openModal, closeModal } = useModal();

  return (
    <Doc>
      <Doc.H1>openModal()</Doc.H1>

      <Doc.Item>
        <Doc.Desc>usage</Doc.Desc>
        <Doc.Code>{`const { openModal, closeModal } = useModal();`}</Doc.Code>
      </Doc.Item>

      <Doc.H2># openModal()</Doc.H2>

      <Doc.Item>
        <Doc.Button
          onClick={() =>
            openModal({
              content: <div>Test</div>,
            })
          }
        >
          open modal with content
        </Doc.Button>

        <Doc.Code lang="jsx">
          {`openModal({
  content: <div>Test</div>
})`}
        </Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button
          onClick={() =>
            openModal({
              type: "success",
            })
          }
        >
          open modal with Type
        </Doc.Button>
        <Doc.Code lang="jsx">{`openModal({
  type: "success"
})`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button
          onClick={() =>
            openModal({
              content: <div>Test</div>,
              backdrop: false,
            })
          }
        >
          open modal without backdrop
        </Doc.Button>
        <Doc.Code lang="jsx">{`openModal({
  content: <div>Test</div>,
  backdrop: false,
})`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button
          onClick={() =>
            openModal({
              id: "test",
              backdrop: false,
            })
          }
        >
          open modal with id
        </Doc.Button>
        <Doc.Code lang="jsx">{`openModal({
  id: "test",
  backdrop: false
})`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button
          onClick={() =>
            openModal({
              onOpen: () => {
                console.log("open");
              },
              onClose: () => {
                console.log("close");
              },
            })
          }
        >
          open modal with callback
        </Doc.Button>
        <Doc.Code lang="jsx">{`openModal({
  onOpen: () => {
    console.log("open");
  },
  onClose: () => {
    console.log("close");
  },
})`}</Doc.Code>
      </Doc.Item>

      <Doc.H2># closeModal()</Doc.H2>

      <Doc.Item>
        <Doc.Button onClick={() => closeModal()}>close all modal</Doc.Button>
        <Doc.Code lang="jsx">{`closeModal()`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button onClick={() => closeModal("test")}>
          close modal with id
        </Doc.Button>
        <Doc.Code lang="jsx">{`closeModal("test")`}</Doc.Code>
      </Doc.Item>
    </Doc>
  );
};
