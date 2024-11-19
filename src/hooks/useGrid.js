import { useRef } from "react";
import utils from "../utils";

export const useGrid = (arg = {}) => {
  const { defaultSchema } = arg;

  const $ = useRef({
    defaultSchema,
    originalData: [],
    data: [],
    dispatch: null,
  });

  const setData = (data) => {
    $.current.originalData = utils.cloneDeep(data);
    $.current.data = utils.cloneDeep(data);
    $.current.dispatch?.({ type: "set_data", payload: $.current.data });
  };

  const getData = () => {
    return $.current.data;
  };

  return { grid: { $useGrid: $ }, setData, getData };
};
