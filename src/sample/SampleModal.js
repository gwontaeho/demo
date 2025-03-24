import { useModal } from "../module/modal";

export const SampleModal = () => {
  const { openModal, closeModal } = useModal();

  return (
    <div className="grid p-4 text-sm">
      <div className="border rounded divide-y [&>div]:flex [&>div]:p-4 [&>div>button]:w-80 [&>div>button]:text-left">
        <div>openModal()</div>

        <div>
          <button
            onClick={() =>
              openModal({
                content: <div>Test</div>,
              })
            }
          >
            open modal with content
          </button>
          <pre>{`openModal({
  content: <div>Test</div>
})`}</pre>
        </div>

        <div>
          <button
            onClick={() =>
              openModal({
                type: "success",
              })
            }
          >
            open modal with Type
          </button>
          <pre>{`openModal({
  type: "success"
})`}</pre>
        </div>

        <div>
          <button
            onClick={() =>
              openModal({
                content: <div>Test</div>,
                backdrop: false,
              })
            }
          >
            open modal without backdrop
          </button>
          <pre>{`openModal({
  content: <div>Test</div>,
  backdrop: false,
})`}</pre>
        </div>

        <div>
          <button
            onClick={() =>
              openModal({
                id: "test",
                backdrop: false,
              })
            }
          >
            open modal with id
          </button>
          <pre>{`openModal({
  id: "test",
  backdrop: false
})`}</pre>
        </div>

        <div>
          <button
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
          </button>
          <pre>{`openModal({
  onOpen: () => {
    console.log("open");
  },
  onClose: () => {
    console.log("close");
  },
})`}</pre>
        </div>

        <div>closeModal()</div>

        <div>
          <button onClick={() => closeModal()}>close all modal</button>
          <pre>{`closeModal()`}</pre>
        </div>

        <div>
          <button onClick={() => closeModal("test")}>
            close modal with id
          </button>
          <pre>{`closeModal("test")`}</pre>
        </div>
      </div>
    </div>
  );
};
