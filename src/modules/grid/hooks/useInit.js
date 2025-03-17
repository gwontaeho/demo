import { useReducer } from "react";
import { useGridContext } from "./useGridContext";

const useInit = (type) => {
  const forceUpdate = useReducer(() => ({}))[1];
  const { init } = useGridContext();
  init(type, forceUpdate);
};

export { useInit };
