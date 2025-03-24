import { useToast } from "../module/toast";

export const SampleToast = () => {
  const { openToast, closeToast } = useToast();

  return (
    <div className="grid p-4 text-sm">
      <div className="border rounded divide-y [&>div]:flex [&>div]:p-4 [&>div>button]:w-80 [&>div>button]:text-left">
        <div>openToast()</div>

        <div>
          <button
            onClick={() =>
              openToast({
                content: <div>Test</div>,
              })
            }
          >
            open toast with content
          </button>
          <pre>{`openToast({
  content: <div>Test</div>
})`}</pre>
        </div>

        <div>
          <button
            onClick={() =>
              openToast({
                type: "success",
              })
            }
          >
            open toast with Type
          </button>
          <pre>{`openToast({
  type: "success"
})`}</pre>
        </div>

        <div>closeToast()</div>

        <div>
          <button onClick={() => closeToast()}>close all toast</button>
          <pre>{`closeToast()`}</pre>
        </div>

        <div>
          <button onClick={() => closeToast("test")}>
            close toast with id
          </button>
          <pre>{`closeToast("test")`}</pre>
        </div>
      </div>
    </div>
  );
};
