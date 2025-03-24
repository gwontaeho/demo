import { useState, createContext, useContext, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

const ToastSetterContext = createContext();

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
    <div className="text-sm flex items-center p-2 border shadow rounded h-[40px] w-[200px]">
      {content}
    </div>
  );
};

const ToastContainer = (props) => {
  const { toasts } = props;
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
  const [toasts, setToasts] = useState([]);
  const methods = useMemo(() => {
    return {
      openToast: (params = {}) => {
        const { id = window.crypto.randomUUID(), ...rest } = params;
        setToasts((prev) => {
          const next = prev.filter((item) => item.id !== id);
          next.push({ id, ...rest });
          return next;
        });
      },
      closeToast: (id) => {
        setToasts(id ? (prev) => prev.filter((item) => item.id !== id) : []);
      },
    };
  }, []);

  return (
    <ToastSetterContext.Provider value={methods}>
      <ToastContainer toasts={toasts} />
      {children}
    </ToastSetterContext.Provider>
  );
};

const useToast = () => {
  const { openToast, closeToast } = useContext(ToastSetterContext);
  return { openToast, closeToast };
};

export { ToastProvider, useToast };
