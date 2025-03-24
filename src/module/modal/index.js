import {
  useState,
  createContext,
  useContext,
  useMemo,
  useEffect,
  useRef,
} from "react";
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

const MODAL_TYPES = {
  success: {},
  error: {},
  info: {},
  warning: {},
};

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

  const _modalRef = useRef(null);
  const _headerRef = useRef(null);

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

  useEffect(() => {
    const draggable = _modalRef.current;
    const header = _headerRef.current;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseDown = (event) => {
      isDragging = true;
      offsetX = event.clientX - draggable.offsetLeft;
      offsetY = event.clientY - draggable.offsetTop;
    };

    const handleMouseMove = (event) => {
      // 영역제한 추가해야함

      if (!isDragging) return;
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;
      draggable.style.left = `${x}px`;
      draggable.style.top = `${y}px`;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    header.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      header.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
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
        ref={_modalRef}
        className="fixed flex flex-col w-[400px] h-[200px] left-1/2 top-1/2 border rounded-lg shadow overflow-hidden bg-gray-50"
        style={style}
      >
        {/* header */}
        <div
          ref={_headerRef}
          className="h-[40px] border-b flex items-center justify-between px-2"
        >
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
      {modals.map((props) => {
        return <Modal key={props.id} {...props} />;
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
          let next = prev.filter((item) => item.id !== id);
          next.push({ id, ...rest });
          next = next.map((item, index) => {
            return { ...item, index };
          });
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
