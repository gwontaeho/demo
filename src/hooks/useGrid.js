import { useRef } from "react";

const cloneDeep = (item) => {
  if (item === null || typeof item !== "object") {
    return item;
  }
  if (Array.isArray(item)) {
    return item.map(cloneDeep);
  }
  const obj = {};
  for (let key in item) {
    if (item.hasOwnProperty(key)) {
      obj[key] = cloneDeep(item[key]);
    }
  }
  return obj;
};

export const useGrid = (params = {}) => {
  const { defaultSchema } = params;

  const $ = useRef({
    defaultSchema,
    originalData: [],
    data: [],
    dispatch: null,
  });

  const setData = (data) => {
    $.current.originalData = cloneDeep(data);
    $.current.data = cloneDeep(data);
    $.current.dispatch?.({ type: "SET_DATA", payload: $.current.data });
  };

  const getData = () => {
    return $.current.data;
  };

  return { schema: { $useGrid: $.current }, setData, getData };
};
