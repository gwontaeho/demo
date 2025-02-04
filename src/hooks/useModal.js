import { useRef, useState, createContext, useContext } from "react";
import { createPortal } from "react-dom";

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
      <ModalContainer />
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const modal = useContext(ModalContext);

  const openModal = (params = {}) => {
    const { id = uuid(), content, type } = params;
    modal.setModals((prev) => {
      const next = prev.filter((item) => item.id !== id);
      next.push({ id, content });
      return next;
    });
  };

  const closeModal = (id) => {
    modal.setModals(id ? (prev) => prev.filter((item) => item.id !== id) : []);
  };

  return { openModal, closeModal };
};

const ModalContainer = () => {
  const modal = useContext(ModalContext);
  const [modals, setModals] = useState([]);
  if (modal.setModals !== setModals) {
    modal.setModals = setModals;
  }

  if (!modals.length) return null;
  return createPortal(
    <div className="fixed w-screen h-screen top-0 left-0 flex items-center justify-center">
      {modals.map((props) => {
        return <Modal key={props.id} {...props} />;
      })}
    </div>,
    document.body
  );
};

const Modal = (props) => {
  const { id, content } = props;
  const { closeModal } = useModal();
  return (
    <div className="absolute w-[400px] h-[200px] border rounded-lg shadow overflow-hidden">
      <div className="h-[40px] bg-gray-50 border-b flex items-center justify-between px-2">
        <div></div>
        <button type="button" onClick={() => closeModal(id)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="p-1">{content}</div>
    </div>
  );
};
