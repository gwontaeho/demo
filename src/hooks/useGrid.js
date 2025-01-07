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
    schema: defaultSchema,
    originalData: [],
    data: [],
    dispatch: null,
  });

  const setHeader = (value) => {
    const nextHeader = cloneDeep(
      value instanceof Function
        ? value(cloneDeep($.current.schema.header))
        : value
    );
    $.current.schema.header = nextHeader;
    $.current.dispatch?.({ type: "SET_HEADER", payload: $.current.schema });
  };

  const setBody = (value) => {};

  const setSchema = () => {};

  const setEdit = () => {};

  const addRow = () => {};

  const removeRow = () => {};

  const setData = (data) => {
    $.current.originalData = cloneDeep(data);
    $.current.data = cloneDeep(data);
    $.current.dispatch?.({ type: "SET_DATA", payload: $.current.data });
  };

  const getData = () => {
    return $.current.data;
  };

  return { schema: { $useGrid: $.current }, setData, getData, setHeader };
};
