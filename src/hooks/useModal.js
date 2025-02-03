import { useRef, useState, createContext, useContext } from "react";

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const ModalContext = createContext();

export const ModalContextProvider = ({ children }) => {
  const modal = useRef({
    setModals: null,
  }).current;

  return (
    <ModalContext.Provider value={modal}>
      {children}
      <Modal modal={modal} />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const modal = useContext(ModalContext);

  const openModal = (params = {}) => {
    const { id = uuid(), content } = params;

    modal.setModals((prev) => {
      const next = prev.filter((item) => item.id !== id);
      next.push({ id, content });
      return next;
    });
  };

  return { openModal };
};

const Modal = ({ modal }) => {
  const [modals, setModals] = useState([]);
  if (modal.setModals === null) {
    modal.setModals = setModals;
  }

  console.log(modals);

  return <div>qwdqwd</div>;
};
