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

const makeHeader = (schema) => {
  const { radio, checkbox, header } = schema;
  const { headerWidths, headerRowCount } = header.reduce(
    (prev, curr) => {
      curr.visible ??= true;
      curr.colCount ??= 1;
      curr.rowCount ??= 1;
      const { colWidths } = curr.cells.reduce(
        (item, cell) => {
          cell.colSpan ??= 1;
          cell.rowSpan ??= 1;
          item.colSpan += cell.colSpan;
          if (cell.width && cell.colSpan === 1)
            item.colWidths[item.colSpan - 1] = cell.width;
          if (item.colSpan >= curr.colCount) item.colSpan = 0;
          return item;
        },
        {
          colWidths: new Array(curr.colCount).fill("200px"),
          colSpan: 0,
          rowCount: 0,
        }
      );
      prev.headerWidths = prev.headerWidths.concat(colWidths);
      prev.headerRowCount < curr.rowCount &&
        (prev.headerRowCount = curr.rowCount);
      return prev;
    },
    { headerWidths: [], headerRowCount: 0 }
  );
  for (let i = 0; i < checkbox + radio; i++) {
    headerWidths.unshift("32px");
  }
  return { headerWidths, headerRowCount };
};

const makeBody = (schema) => {
  const { editable, body, header } = schema;
  const { bodyRowCount } = body.reduce(
    (prev, curr, index) => {
      curr.visible = header[index].visible;
      curr.colCount ??= 1;
      curr.rowCount ??= 1;
      curr.cells.forEach((item) => {
        item.colSpan ??= 1;
        item.rowSpan ??= 1;
        item.editable = editable;
      });
      prev.bodyRowCount < curr.rowCount && (prev.bodyRowCount = curr.rowCount);
      return prev;
    },
    { bodyRowCount: 0 }
  );
  return { bodyRowCount };
};

const makeSchema = (schema) => {
  schema.editable ??= false;
  schema.radio ??= false;
  schema.checkbox ??= false;
  const { headerWidths, headerRowCount } = makeHeader(schema);
  const { bodyRowCount } = makeBody(schema);
  schema.headerWidths = headerWidths;
  schema.headerRowCount = headerRowCount;
  schema.bodyRowCount = bodyRowCount;
  return schema;
};

/**
 * @typedef {Object} HeaderCell
 * @property {string} binding
 * @property {string} width
 */

/**
 * @typedef {Object} HeaderColumn
 * @property {string} id
 * @property {boolean} visible
 * @property {Array<HeaderCell>} cells
 */

/**
 * @typedef {Object} BodyCell
 * @property {string} id
 * @property {string} type
 * @property {boolean} editable
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
 * @property {boolean} radio
 * @property {boolean} checkbox
 * @property {boolean} editable
 * @property {boolean|'external'} pagination
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

  const _ = useRef({
    data: [],
    originalData: [],
    addedData: [],
    removedData: [],
    updatedData: [],
    checkboxData: [],
    radioData: null,
    dataCount: 0,
    schema: makeSchema(cloneDeep(defaultSchema)),
    renderGrid: null,
    renderHeader: null,
    renderBody: null,
    renderFooter: null,
  }).current;

  const method = useRef({
    ref: _,
    getSchema: () => {
      return cloneDeep(_.schema);
    },
    getData: () => {
      return cloneDeep(_.data);
    },
    getDataCount: () => {
      return _.dataCount;
    },
    setEditable: (value) => {
      if (typeof value !== "boolean" || _.schema.editable === value) return;
      _.schema.edit = value;
      _.schema = makeSchema(_.schema);
      _.renderBody?.();
    },
    setData: (data, dataCount) => {
      _.data = cloneDeep(data);
      _.originalData = cloneDeep(data);
      _.addedData = [];
      _.removedData = [];
      _.updatedData = [];
      _.checkboxData = [];
      _.radioData = null;
      _.dataCount = dataCount ?? data.length;
      _.renderBody?.();
      _.renderFooter?.();
    },
    setHeight: (value) => {
      if (_.schema.height === value) return;
      _.schema.height = value;
      _.renderGrid?.();
      _.renderBody?.();
    },
  }).current;

  return { ...method };
};
