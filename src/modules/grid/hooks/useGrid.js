import { useRef } from "react";
import {
  uuid,
  cloneDeep,
  makeBody,
  makeHeader,
  makeSchema,
} from "../utils/utils";

/**
 * @typedef {Object} HeaderCell
 * @property {string} field
 * @property {string} width
 * @property {number} rowSpan
 * @property {number} colSpan
 */

/**
 * @typedef {Object} HeaderColumn
 * @property {string} id
 * @property {boolean} visible
 * @property {number} rowCount
 * @property {number} colCount
 * @property {Array<HeaderCell>} cells
 */

/**
 * @typedef {Object} BodyCell
 * @property {string} id
 * @property {string} type
 * @property {boolean} editable
 * @property {string} field
 * @property {Array} options
 * @property {number} rowSpan
 * @property {number} colSpan
 */

/**
 * @typedef {Object} BodyColumn
 * @property {number} rowCount
 * @property {number} colCount
 * @property {Array<BodyCell>} cells
 */

/**
 * @typedef {Object} DefaultSchema
 * @property {number} page
 * @property {number} size
 * @property {boolean} index
 * @property {boolean} radio
 * @property {boolean} checkbox
 * @property {boolean} editable
 * @property {boolean|'external'} pagination
 * @property {number} height
 * @property {Array<HeaderColumn>} header
 * @property {Array<BodyColumn>} body
 */

/**
 * @param {Object} params
 * @param {DefaultSchema} params.defaultSchema
 * @returns
 */
const useGrid = (params = {}) => {
  const { defaultSchema } = params;

  const _ = useRef({
    data: [],
    originalData: [],
    addedData: [],
    removedData: [],
    updatedData: [],
    radioData: null,
    checkboxData: [],
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
    getRadioData: () => {
      return cloneDeep(_.radioData);
    },
    getCheckboxData: () => {
      return cloneDeep(_.checkboxData);
    },
    getAddedData: () => {
      return cloneDeep(_.addedData);
    },
    getRemoveData: () => {
      return cloneDeep(_.removedData);
    },
    getUpdatedData: () => {
      return cloneDeep(_.updatedData);
    },
    getPage: () => {
      return _.schema.page;
    },
    getSize: () => {
      return _.schema.size;
    },

    setData: (newData, newDataCount) => {
      _.data = cloneDeep(newData);
      _.originalData = cloneDeep(_.data);
      _.addedData = [];
      _.removedData = [];
      _.updatedData = [];
      _.checkboxData = [];
      _.radioData = null;
      _.dataCount = newDataCount ?? newData.length;
      _.renderBody?.();
      _.renderFooter?.();
    },
    setSchema: (newSchema) => {
      _.schema = makeSchema(cloneDeep(newSchema));
      _.renderGrid?.();
      _.renderHeader?.();
      _.renderBody?.();
      _.renderFooter?.();
    },
    setHeader: (newHeader) => {
      _.schema.header = cloneDeep(newHeader);
      _.schema = makeSchema(_.schema);
      _.renderGrid?.();
      _.renderHeader?.();
      _.renderBody?.();
      _.renderFooter?.();
    },
    setBody: (newBody) => {
      _.schema.body = cloneDeep(newBody);
      _.schema = makeSchema(_.schema);
      _.renderGrid?.();
      _.renderHeader?.();
      _.renderBody?.();
      _.renderFooter?.();
    },
    setEditable: (newEditable) => {
      const oldEditable = _.schema.editable;
      if (typeof newEditable !== "boolean" || oldEditable === newEditable)
        return;
      _.schema.editable = newEditable;
      _.schema = makeSchema(_.schema);
      _.renderBody?.();
    },
    setHeight: (newHeight) => {
      const oldHeight = _.schema.height;
      if (oldHeight === newHeight) return;
      _.schema.height = newHeight;
      _.renderGrid?.();
      _.renderBody?.();
    },
    setPage: (newPage) => {
      _.schema.page = newPage;
      _.renderBody?.();
      _.renderFooter?.();
    },
    setSize: (newSize) => {
      _.schema.page = 0;
      _.schema.size = newSize;
      _.renderBody?.();
      _.renderFooter?.();
    },

    addRow: (newRow = {}) => {
      _.data.push(newRow);
      _.addedData.push(newRow);
      _.dataCount = _.data.length;
      _.renderBody?.();
      _.renderFooter?.();
    },
    removeRow: (dataIndex) => {
      const removedRow = _.data[dataIndex];
      if (!removedRow) return;
      _.data.splice(dataIndex, 1);
      _.removedData.push(removedRow);
      _.dataCount = _.data.length;
      _.renderBody?.();
      _.renderFooter?.();
    },
    updateRow: (dataIndex, field, value) => {
      _.data[dataIndex][field] = cloneDeep(value);
      _.renderBody?.();
    },
    upRow: (dataIndex) => {
      if (dataIndex < 1) return;
      const target = _.data[dataIndex];
      _.data[dataIndex] = _.data[dataIndex - 1];
      _.data[dataIndex - 1] = target;
      _.renderBody?.();
    },
    downRow: (dataIndex) => {
      if (dataIndex + 1 > _.dataCount - 1) return;
      const target = _.data[dataIndex];
      _.data[dataIndex] = _.data[dataIndex + 1];
      _.data[dataIndex + 1] = target;
      _.renderBody?.();
    },
  }).current;

  return { ...method };
};

export { useGrid };
