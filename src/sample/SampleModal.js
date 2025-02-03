import { useModal } from "../hooks/useModal";

export const SampleModal = () => {
  console.log("Modal");
  const { openModal } = useModal();

  return (
    <div>
      <button onClick={() => openModal({ content: <div>qwdqwd</div> })}>
        open
      </button>
    </div>
  );
};
