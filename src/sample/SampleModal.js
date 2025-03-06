import { useEffect, useLayoutEffect } from "react";
import { useModal } from "../modules/modal";
import { useToast } from "../modules/toast";

export const SampleModal = () => {
  console.log("Modal");
  const { openModal } = useModal();
  const { openToast } = useToast();

  useEffect(() => {
    // openModal({ content: <div>qwdqwd</div> });
  }, []);

  useLayoutEffect(() => {
    console.log("1");
    // openModal({ content: <div>qwdqwd</div> });
  }, []);

  return (
    <div>
      <button
        onClick={() => openModal({ id: "11", content: <div>qwdqwd</div> })}
      >
        open
      </button>
      <button onClick={() => openToast({ content: <div>qwdqwd</div> })}>
        open toast
      </button>
    </div>
  );
};
