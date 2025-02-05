import { usePopup } from "../modules/popup";

export const SamplePopup = () => {
  const { openPopup, closePopup } = usePopup();

  const test1 = () => {
    openPopup({ url: "http://localhost:3000" });
  };
  const test = () => {
    openPopup({ id: "tt", url: "http://localhost:3000" });
  };

  const close = () => {
    closePopup("tt");
  };

  return (
    <div>
      <button onClick={test1}>open</button>
      <button onClick={test}>open</button>
      <button onClick={close}>close</button>
    </div>
  );
};
