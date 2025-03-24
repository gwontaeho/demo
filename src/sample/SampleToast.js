import { useToast } from "../module/toast";

export const SampleToast = () => {
  const { openToast, closeToast } = useToast();

  return (
    <div className="grid p-4 text-sm">
      <div className="border rounded divide-y [&>div]:flex [&>div]:p-4 [&>div>button]:w-80 [&>div>button]:text-left">
        <div>
          <button onClick={() => openToast({ content: <div>Test</div> })}>
            open toast with content
          </button>
          <pre>{`openToast({ content: <div>Test</div> })`}</pre>
        </div>

        <div>
          <button onClick={() => openToast({ type: "success" })}>
            open modal with Type
          </button>
          <pre>{`openToast({ type: "success" })`}</pre>
        </div>

        <div>
          <button onClick={() => closeToast()}>close all modal</button>
          <pre>{`closeModal()`}</pre>
        </div>

        <div>
          <button onClick={() => closeToast({ content: <div>Test</div> })}>
            close modal with id
          </button>
          <pre>{`openToast({ content: <div>Test</div> })`}</pre>
        </div>
      </div>
    </div>
  );
};
