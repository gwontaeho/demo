import { useContext } from "react";
import { GridContext } from "../utils/context";

const useGridContext = () => {
  return useContext(GridContext);
};

export { useGridContext };
