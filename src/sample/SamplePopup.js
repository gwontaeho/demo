import { usePopup } from "../modules/popup";

export const SamplePopup = () => {
  const { openPopup, closePopup, postMessageToOpener } = usePopup();

  const test1 = () => {
    openPopup({
      url: "http://localhost:8080",
      onMessage: (data) => {
        console.log(data);
      },
    });
  };

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
      <button onClick={test1}>open</button>
      <button onClick={test}>open</button>
      <button onClick={close}>close</button>
      <button onClick={handleMessage}>message</button>
    </div>
  );
};
