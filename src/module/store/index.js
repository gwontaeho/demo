import { createContext, useContext, useRef } from "react";

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const _store = useRef({}).current;

  return (
    <StoreContext.Provider value={_store}>{children}</StoreContext.Provider>
  );
};

const useStore = () => {
  const {} = useContext(StoreContext);

  const getStore = () => {};
};

export { StoreProvider, useStore };
