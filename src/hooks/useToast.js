import { useRef, useState, createContext, useContext, useEffect } from "react";
import { createPortal } from "react-dom";

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const ToastContext = createContext();

export const ToastContextProvider = ({ children }) => {
  const toast = useRef({
    setToasts: null,
  }).current;
  return (
    <ToastContext.Provider value={toast}>
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const toast = useContext(ToastContext);

  const openToast = (params = {}) => {
    const { id = uuid(), content, type } = params;
    toast.setToasts((prev) => {
      const next = prev.filter((item) => item.id !== id);
      next.push({ id, content });
      return next;
    });
  };

  const closeToast = (id) => {
    toast.setToasts(id ? (prev) => prev.filter((item) => item.id !== id) : []);
  };

  return { openToast, closeToast };
};

const ToastContainer = () => {
  const toast = useContext(ToastContext);
  const [toasts, setToasts] = useState([]);
  if (toast.setToasts !== setToasts) {
    toast.setToasts = setToasts;
  }

  if (!toasts.length) return null;
  return createPortal(
    <div className="fixed right-0 bottom-0">
      {toasts.map((props) => {
        return <Toast key={props.id} {...props} />;
      })}
    </div>,
    document.body
  );
};

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

  return <div className="border h-[40px] w-[200px]">{content}</div>;
};
