import { useRef, useState, createContext, useContext, useEffect } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext();

const Toast = (props) => {
  const { id, content } = props;
  const { closeToast } = useToast();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      closeToast(id);
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="border shadow rounded h-[40px] w-[200px]">{content}</div>
  );
};

const ToastContainer = () => {
  const { initialize } = useContext(ToastContext);
  const [toasts, setToasts] = useState([]);
  initialize(setToasts);
  if (!toasts.length) return null;
  return createPortal(
    <div className="fixed right-0 bottom-0 p-4 flex flex-col gap-1">
      {toasts.map((props) => {
        return <Toast key={props.id} {...props} />;
      })}
    </div>,
    document.body
  );
};

const ToastProvider = ({ children }) => {
  const _toast = useRef(null);
  if (_toast.current === null) {
    _toast.current = new (class {
      #setToasts = null;
      initialize = (param) => {
        if (param !== this.#setToasts) {
          this.#setToasts = param;
        }
      };
      openToast = (params = {}) => {
        const { id = crypto.randomUUID(), content, type } = params;
        this.#setToasts?.((prev) => {
          const next = prev.filter((item) => item.id !== id);
          next.push({ id, content });
          return next;
        });
      };
      closeToast = (id) => {
        this.#setToasts?.(
          id ? (prev) => prev.filter((item) => item.id !== id) : []
        );
      };
    })();
  }
  return (
    <ToastContext.Provider value={_toast.current}>
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const { openToast, closeToast } = useContext(ToastContext);
  return { openToast, closeToast };
};

export { ToastProvider, useToast };
