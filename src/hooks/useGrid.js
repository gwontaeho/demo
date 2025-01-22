import { useRef } from "react";

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

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

/**
 * @typedef {Object} HeaderCell
 * @property {string} binding
 * @property {string} width
 */

/**
 * @typedef {Object} HeaderColumn
 * @property {string} id
 * @property {boolean} show
 * @property {Array<HeaderCell>} cells
 */

/**
 * @typedef {Object} BodyCell
 * @property {string} id
 * @property {string} type
 * @property {boolean} edit
 * @property {string} binding
 * @property {Array} options
 */

/**
 * @typedef {Object} BodyColumn
 * @property {Array<BodyCell>} cells
 */

/**
 * @typedef {Object} DefaultSchema
 * @property {number} page
 * @property {number} size
 * @property {boolean} edit
 * @property {boolean} radio
 * @property {boolean} checkbox
 * @property {string|number} height
 * @property {Array<HeaderColumn>} header
 * @property {Array<BodyColumn>} body
 */

/**
 * @param {Object} params
 * @param {DefaultSchema} params.defaultSchema
 * @returns
 */
export const useGrid = (params = {}) => {
  const { defaultSchema } = params;

  const $ = useRef({
    keyBase: uuid(),
    defaultSchema: cloneDeep(defaultSchema),
    schema: cloneDeep(defaultSchema),

    data: [],
    originalData: [],
    addedData: [],
    removedData: [],
    updatedData: [],
    checkboxData: [],
    radioData: null,

    dataCount: 0,

    renderGrid: null,
    renderHeader: null,
    renderBody: null,
    renderFooter: null,

    onPageChange: null,
    onSizeChange: null,

    renderer: null,
  }).current;

  const setSchema = (value) => {
    // 스키마를 검증하는 로직 필요
    const nextSchema = cloneDeep(
      value instanceof Function ? value(cloneDeep($.schema)) : value
    );
    $.schema = nextSchema;
    $.renderGrid?.();
    $.renderHeader?.();
    $.renderBody?.();
    $.renderFooter?.();
  };

  const setHeader = (value) => {
    // 스키마를 검증하는 로직 필요
    const nextHeader = cloneDeep(
      value instanceof Function ? value(cloneDeep($.schema.header)) : value
    );
    $.schema.header = nextHeader;
    $.renderHeader?.();
    $.renderBody?.();
  };

  const setBody = (value) => {
    // 스키마를 검증하는 로직 필요
    const nextBody = cloneDeep(
      value instanceof Function ? value(cloneDeep($.schema.body)) : value
    );
    $.schema.body = nextBody;
    $.renderBody?.();
  };

  const setEdit = (value) => {
    // 전체, 컬럼
    if (typeof value !== "boolean" || $.schema.edit === value) return;
    $.schema.edit = value;
    $.renderBody?.();
  };

  const setShow = (id, value) => {
    // 헤더, 바디 id
    if (typeof value !== "boolean") return;
    const target = $.schema.header.find((item) => item.id === id);
    if (!target || (target.show ?? true) === value) return;
    target.show = value;
    $.renderHeader?.();
    $.renderBody?.();
  };

  // ok
  const addRow = () => {
    if ($.schema.pagination === "external") return;
    const addedData = {};
    $.data.push(addedData);
    $.addedData.push(addedData);
    $.dataCount = $.data.length;
    $.renderBody?.();
    $.renderFooter?.();
  };

  // ok
  const removeRow = (index) => {
    if ($.schema.pagination === "external") return;
    const removed = $.data.splice(index, 1);
    if (!removed.length) return;
    const target = removed[0];
    $.removedData.push(target);
    const addedIndex = $.addedData.findIndex((item) => item === target);
    if (addedIndex !== -1) $.addedData.splice(addedIndex, 1);
    $.dataCount = $.data.length;
    $.renderBody?.();
    $.renderFooter?.();
  };

  // ok
  const setPage = (value) => {
    if (
      !$.schema.pagination ||
      typeof value !== "number" ||
      $.schema.page === value
    )
      return;
    $.schema.page = value;
    if ($.schema.pagination !== "external") $.renderBody?.();
    $.renderFooter?.();
  };

  // ok
  const setSize = (value) => {
    if (
      !$.schema.pagination ||
      typeof value !== "number" ||
      $.schema.size === value
    )
      return;
    $.schema.page = 0;
    $.schema.size = value;
    if ($.schema.pagination !== "external") $.renderBody?.();
    $.renderFooter?.();
  };

  // ok
  const getPage = () => {
    return $.schema.page;
  };

  // ok
  const getSize = () => {
    return $.schema.size;
  };

  // ok
  const setData = (data, dataCount) => {
    $.keyBase = uuid();
    $.originalData = cloneDeep(data);
    $.data = cloneDeep(data);
    $.addedData = [];
    $.removedData = [];
    $.updatedData = [];
    $.checkboxData = [];
    $.radioData = null;
    $.dataCount = dataCount ?? $.data.length;
    $.renderBody?.();
    $.renderFooter?.();
  };

  // ok
  const getData = () => {
    return cloneDeep($.data);
  };

  // ok
  const getCheckboxData = () => {
    return cloneDeep($.checkboxData);
  };

  // ok
  const getRadioData = () => {
    return cloneDeep($.radioData);
  };

  const getAddedData = () => {
    return cloneDeep($.addedData);
  };

  const getOriginData = () => {
    return cloneDeep($.originalData);
  };

  const getRemovedData = () => {
    return cloneDeep($.removedData);
  };

  const getUpdatedData = () => {
    return cloneDeep($.updatedData);
  };

  // ok
  const upRow = (index) => {
    if (index < 1) return;
    const target = $.data[index];
    $.data[index] = $.data[index - 1];
    $.data[index - 1] = target;
    $.renderBody?.();
  };

  // ok
  const downRow = (index) => {
    if (index + 1 > $.data.length - 1) return;
    const target = $.data[index];
    $.data[index] = $.data[index + 1];
    $.data[index + 1] = target;
    $.renderBody?.();
  };

  const validate = () => {};

  // ok
  const setHeight = (value) => {
    if ($.schema.height === value) return;
    $.schema.height = value;
    $.renderGrid?.();
    $.renderBody?.();
  };

  // ok
  const setRadio = (value) => {
    if (typeof value !== "boolean" || ($.schema.radio ?? false) === value)
      return;
    $.schema.radio = value;
    $.renderHeader?.();
    $.renderBody?.();
  };

  // ok
  const setCheckbox = (value) => {
    if (typeof value !== "boolean" || ($.schema.checkbox ?? false) === value)
      return;
    $.schema.checkbox = value;
    $.renderHeader?.();
    $.renderBody?.();
  };

  const setSort = (key) => {
    if (key) {
      $.schema.sort = key;
    } else {
      delete $.schema.sort;
    }
    $.renderBody?.();
  };

  const setGroup = (key) => {
    if (key) {
      $.schema.group = key;
    } else {
      delete $.schema.group;
    }
    $.renderBody?.();
  };

  const setOnPageChange = (callback) => {
    if (!(callback instanceof Function)) return;
    $.onPageChange = callback;
  };

  const setOnSizeChange = (callback) => {
    if (!(callback instanceof Function)) return;
    $.onSizeChange = callback;
  };

  const setRenderer = (renderer) => {
    // 렌더러 검증 로직 필요
    $.renderer = renderer;
  };

  return {
    schema: { $useGrid: $ },
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
    getPage,
    getSize,
    setHeight,
    getOriginData,
    getAddedData,
    getRemovedData,
    getUpdatedData,
    getRadioData,
    getCheckboxData,
    upRow,
    downRow,
    setSort,
    setGroup,
    setShow,
    setRadio,
    setCheckbox,
    setOnPageChange,
    setOnSizeChange,
    setRenderer,
  };
};
