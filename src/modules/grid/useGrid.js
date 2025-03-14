import { useRef } from "react";
import { cloneDeep, makeBody, makeHeader, makeSchema } from "./utils";

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
      _.schema.editable = value;
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
