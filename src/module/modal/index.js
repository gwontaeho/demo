import { useState, createContext, useContext, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * @typedef {Object} ModalParams
 * @property {string} [id]
 * @property {any} [content]
 * @property {string} [type]
 * @property {boolean} [backdrop=true]
 * @property {boolean} [closeOnBackdropClick=true]
 * @property {Function} [onOpen]
 * @property {Function} [onClose]
 */

const ModalSetterContext = createContext();

const Modal = (props) => {
  const {
    index,
    id,
    content,
    backdrop = true,
    closeOnBackdropClick = true,
    onOpen,
    onClose,
  } = props;
  const { closeModal } = useModal();

  useEffect(() => {
    if (onOpen) {
      onOpen();
    }

    return () => {
      if (onClose) {
        onClose();
      }
    };
  }, []);

  const style = {
    transform: `translate(calc(-50% + ${index * 4}px), calc(-50% + ${
      index * 4
    }px))`,
  };

  return (
    <>
      {backdrop && (
        <div
          className="fixed w-screen h-screen top-0 left-0 bg-black/5"
          onClick={closeOnBackdropClick ? () => closeModal(id) : undefined}
        />
      )}
      <div
        className="fixed flex flex-col w-[400px] h-[200px] left-1/2 top-1/2 border rounded-lg shadow overflow-hidden bg-gray-50"
        style={style}
      >
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
    </>
  );
};

const ModalContainer = (props) => {
  const { modals } = props;
  if (!modals.length) return null;
  return createPortal(
    <>
      {modals.map((props, index) => {
        return <Modal key={props.id} index={index} {...props} />;
      })}
    </>,
    document.body
  );
};

const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState([]);
  const methods = useMemo(() => {
    return {
      openModal: (params) => {
        const { id = window.crypto.randomUUID(), ...rest } = params;
        setModals((prev) => {
          const next = prev.filter((item) => item.id !== id);
          next.push({ id, ...rest });
          return next;
        });
      },
      closeModal: (id) => {
        setModals(id ? (prev) => prev.filter((item) => item.id !== id) : []);
      },
    };
  }, []);
  return (
    <ModalSetterContext.Provider value={methods}>
      <ModalContainer modals={modals} />
      {children}
    </ModalSetterContext.Provider>
  );
};

/**
 * @returns {{ openModal: (params: ModalParams) => void, closeModal: (id?: string) => void }}
 */
const useModal = () => {
  const { openModal, closeModal } = useContext(ModalSetterContext);
  return { openModal, closeModal };
};

export { ModalProvider, useModal };
