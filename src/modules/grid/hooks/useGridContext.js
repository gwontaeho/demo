import { useContext } from "react";
import { GridContext } from "../context";

const useGridContext = () => {
  return useContext(GridContext);
};

export { useGridContext };
