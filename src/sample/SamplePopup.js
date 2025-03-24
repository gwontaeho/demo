import { usePopup } from "../module/popup";

export const SamplePopup = () => {
  const { openPopup, closePopup, postMessageToOpener } = usePopup();

  const test = () => {
    openPopup({
      id: "tt",
      url: "http://localhost:8080",
      onMessage: (data) => {
        console.log(data);
      },
    });
  };

  const close = () => {
    closePopup("tt");
  };

  const handleMessage = () => {
    postMessageToOpener({
      asd: "dqwd",
      bb: { g: "s" },
      a: window.name,
    });
  };

  return (
    <div>
      <div className="grid grid-cols-4">
        <button
          onClick={() => {
            openPopup({
              url: "http://localhost:8080",
            });
          }}
        >
          Open Popup
        </button>
        <button onClick={test}>open</button>
        <button onClick={close}>close</button>
        <button onClick={handleMessage}>message</button>
      </div>
    </div>
  );
};
