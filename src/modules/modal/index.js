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

const Modal = (props) => {
  const { id, content } = props;
  const { closeModal } = useModal();
  return (
    <div className="absolute flex flex-col w-[400px] h-[200px] border rounded-lg shadow overflow-hidden bg-gray-50">
      {/* header */}
      <div className="h-[40px] border-b flex items-center justify-between px-2">
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
      {/* content */}
      <div className="flex-1 p-1">{content}</div>
      {/* footer */}
      <div className="h-[40px] border-t flex items-center justify-between px-2">
        <div></div>
      </div>
    </div>
  );
};

const ModalContainer = () => {
  const { initialize } = useContext(ModalContext);
  const [modals, setModals] = useState([]);
  initialize(setModals);
  if (!modals.length) return null;
  return createPortal(
    <div className="fixed w-screen h-screen top-0 left-0 flex items-center justify-center bg-black/5">
      {modals.map((props) => {
        return <Modal key={props.id} {...props} />;
      })}
    </div>,
    document.body
  );
};

const ModalProvider = ({ children }) => {
  const _modal = useRef(null);
  if (_modal.current === null) {
    _modal.current = new (class {
      #setModals = null;
      initialize = (param) => {
        if (param !== this.#setModals) {
          this.#setModals = param;
        }
      };
      openModal = (params = {}) => {
        const { id = uuid(), content, type } = params;
        this.#setModals?.((prev) => {
          const next = prev.filter((item) => item.id !== id);
          next.push({ id, content });
          return next;
        });
      };
      closeModal = (id) => {
        this.#setModals?.(
          id ? (prev) => prev.filter((item) => item.id !== id) : []
        );
      };
    })();
  }

  return (
    <ModalContext.Provider value={_modal.current}>
      <ModalContainer />
      {children}
    </ModalContext.Provider>
  );
};

const useModal = () => {
  const { openModal, closeModal } = useContext(ModalContext);
  return { openModal, closeModal };
};

export { ModalProvider, useModal };
