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
    defaultSchema: cloneDeep(defaultSchema),
    schema: cloneDeep(defaultSchema),
    originalData: [],
    data: [],
    dispatch: null,
  });

  const setSchema = (value) => {
    const nextSchema = cloneDeep(
      value instanceof Function
        ? value(cloneDeep($.current.schema.body))
        : value
    );
    $.current.schema = nextSchema;
    $.current.dispatch?.({ type: "SET_SCHEMA", payload: $.current.schema });
  };

  const setHeader = (value) => {
    const nextHeader = cloneDeep(
      value instanceof Function
        ? value(cloneDeep($.current.schema.header))
        : value
    );
    $.current.schema.header = nextHeader;
    $.current.dispatch?.({ type: "SET_HEADER", payload: $.current.schema });
  };

  const setBody = (value) => {
    const nextBody = cloneDeep(
      value instanceof Function
        ? value(cloneDeep($.current.schema.body))
        : value
    );
    $.current.schema.body = nextBody;
    $.current.dispatch?.({ type: "SET_BODY", payload: $.current.schema });
  };

  const setEdit = (value) => {
    if (typeof value === "boolean") {
      $.current.schema.edit = value;
    }
    $.current.dispatch?.({ type: "SET_BODY", payload: $.current.schema });
  };

  const addRow = () => {
    $.current.data.push({});
    $.current.dispatch?.({ type: "ADD_ROW", payload: $.current.data });
  };

  const removeRow = (index) => {
    $.current.data.splice(index, 1);
    $.current.dispatch?.({ type: "REMOVE_ROW", payload: $.current.data });
  };

  const setPage = (value) => {
    if (typeof value !== "number") return;
    $.current.schema.page = value;
    $.current.dispatch?.({ type: "SET_PAGE", payload: value });
  };

  const setSize = (value) => {
    if (typeof value !== "number") return;
    $.current.schema.size = value;
    $.current.dispatch?.({ type: "SET_SIZE", payload: value });
  };

  const setData = (data) => {
    $.current.originalData = cloneDeep(data);
    $.current.data = cloneDeep(data);
    $.current.dispatch?.({ type: "SET_DATA", payload: $.current.data });
  };

  const getData = () => {
    return $.current.data;
  };

  return {
    schema: { $useGrid: $.current },
    setData,
    getData,
    setSchema,
    setHeader,
    setBody,
    setEdit,
    addRow,
    removeRow,
    setPage,
    setSize,
  };
};
