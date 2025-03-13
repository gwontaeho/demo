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

  const _useGrid = useRef(null);
  _useGrid.current ??= new (class {
    #schema = makeSchema(cloneDeep(defaultSchema));

    #key = uuid();
    #dataKey = uuid();

    #data = []; //
    #originalData = []; //
    #addedData = []; //
    #removedData = []; //
    #updatedData = []; //
    #checkboxData = []; //
    #radioData = null; //
    #dataCount = 0; //

    #onPageChange = null;
    #onSizeChange = null;
    #renderer = null;

    #renderGrid = null;
    #renderHeader = null;
    #renderBody = null;
    #renderFooter = null;

    schema = { useGrid: this };

    ref = (param) => {};

    initialize = (type, forceUpdate) => {
      switch (type) {
        case "Grid":
          this.#renderGrid = forceUpdate;
          return () => {
            this.#renderGrid = null;
          };
        case "Header":
          this.#renderHeader = forceUpdate;
          return () => {
            this.#renderHeader = null;
          };
        case "Body":
          this.#renderBody = forceUpdate;
          return () => {
            this.#renderBody = null;
          };
        case "Footer":
          this.#renderFooter = forceUpdate;
          return () => {
            this.#renderFooter = null;
          };
      }
    };

    renderGrid = () => {
      this.#renderGrid();
    };

    renderBody = () => {
      this.#renderBody();
    };

    renderHeader = () => {
      this.#renderHeader();
    };

    getKey = () => {
      return this.#key;
    };

    getDataKey = () => {
      return this.#dataKey;
    };

    // a
    getSchema = () => {
      return cloneDeep(this.#schema);
    };

    getDataCount = () => {
      return this.#dataCount;
    };

    // ttt
    setSchema = (value) => {
      const schema = cloneDeep(
        typeof value === "function" ? value(cloneDeep(this.#schema)) : value
      );
      this.#schema = makeSchema(schema);
      this.#renderGrid?.();
      this.#renderHeader?.();
      this.#renderBody?.();
      this.#renderFooter?.();
    };

    // ttt
    setHeader = (value) => {
      // 스키마를 검증하는 로직 필요
      const nextHeader = cloneDeep(
        typeof value === "function"
          ? value(cloneDeep(this.#schema.header))
          : value
      );
      this.#schema.header = nextHeader;
      this.#schema = makeSchema(this.#schema);
      this.#renderHeader?.();
      this.#renderBody?.();
    };

    // ttt
    setBody = (value) => {
      // 스키마를 검증하는 로직 필요
      const nextBody = cloneDeep(
        typeof value === "function"
          ? value(cloneDeep(this.#schema.body))
          : value
      );
      this.#schema.body = nextBody;
      this.#schema = makeSchema(this.#schema);
      this.#renderBody?.();
    };

    // ok
    // ttt
    setHeight = (value) => {
      if (this.#schema.height === value) return;
      this.#schema.height = value;
      this.#renderGrid?.();
      this.#renderBody?.();
    };

    // ok
    // ttt
    setRadio = (value) => {
      if (typeof value !== "boolean" || (this.#schema.radio ?? false) === value)
        return;
      this.#schema.radio = value;
      this.#renderHeader?.();
      this.#renderBody?.();
    };

    setRadioData = (index) => {
      if (typeof index !== "number") return;
      this.#radioData = index === undefined ? null : this.#data[index];
      this.#renderBody?.();
    };

    setCheckboxData = () => {};

    // ok
    // ttt
    setCheckbox = (value) => {
      if (
        typeof value !== "boolean" ||
        (this.#schema.checkbox ?? false) === value
      )
        return;
      this.#schema.checkbox = value;
      this.#renderHeader?.();
      this.#renderBody?.();
    };

    // ttt
    setEdit = (value) => {
      // 전체, 컬럼
      if (typeof value !== "boolean" || this.#schema.edit === value) return;
      this.#schema.edit = value;
      this.#schema = makeSchema(this.#schema);
      this.#renderBody?.();
    };

    // ttt
    setShow = (id, value) => {
      // 헤더, 바디 id
      if (typeof value !== "boolean") return;
      const target = this.#schema.header.find((item) => item.id === id);
      if (!target || (target.show ?? true) === value) return;
      target.show = value;
      this.#renderHeader?.();
      this.#renderBody?.();
    };

    // ok
    // ttt
    addRow = () => {
      if (this.#schema.pagination === "external") return;
      const addedData = {};
      this.#data.push(addedData);
      this.#addedData.push(addedData);
      this.#dataCount = this.#data.length;
      this.#renderBody?.();
      this.#renderFooter?.();
    };

    // ok
    // ttt
    removeRow = (index) => {
      if (this.#schema.pagination === "external") return;
      const removed = this.#data.splice(index, 1);
      if (!removed.length) return;
      const target = removed[0];
      this.#removedData.push(target);
      const addedIndex = this.#addedData.findIndex((item) => item === target);
      if (addedIndex !== -1) this.#addedData.splice(addedIndex, 1);
      this.#dataCount = this.#data.length;
      this.#renderBody?.();
      this.#renderFooter?.();
    };

    // ok
    // ttt
    setPage = (value) => {
      if (
        !this.#schema.pagination ||
        typeof value !== "number" ||
        this.#schema.page === value
      )
        return;
      this.#schema.page = value;
      if (this.#schema.pagination !== "external") this.#renderBody?.();
      this.#renderFooter?.();
    };

    // ok
    // ttt
    setSize = (value) => {
      if (
        !this.#schema.pagination ||
        typeof value !== "number" ||
        this.#schema.size === value
      )
        return;
      this.#schema.page = 0;
      this.#schema.size = value;
      if (this.#schema.pagination !== "external") this.#renderBody?.();
      this.#renderFooter?.();
    };

    // ttt
    getPagination = () => {
      return this.#schema.pagination;
    };

    // ok
    // ttt
    getPage = () => {
      return this.#schema.page;
    };

    // ok
    // ttt
    getSize = () => {
      return this.#schema.size;
    };

    // ok
    // ttt
    setData = (data, dataCount) => {
      this.#key = uuid();
      this.#originalData = cloneDeep(data);
      this.#data = cloneDeep(data);
      this.#addedData = [];
      this.#removedData = [];
      this.#updatedData = [];
      this.#checkboxData = [];
      this.#radioData = null;
      this.#dataCount = dataCount ?? this.#data.length;
      this.#renderBody?.();
      this.#renderFooter?.();
    };

    setRowData = (index, value) => {
      const row = this.#data[index];
      const nextValue = cloneDeep(
        typeof value === "function" ? cloneDeep(row) : value
      );
      Object.keys(row).forEach((key) => delete row[key]);
      Object.assign(row, nextValue);
      this.#renderBody?.();
    };

    isRadioData = (index) => {
      return this.#data[index] === this.#radioData;
    };

    isCheckboxData = (index) => {
      return this.#checkboxData.includes(this.#data[index]);
    };

    getTest = (index) => {
      return this.#data[index];
    };

    getHeight = () => {
      return this.#schema.height;
    };

    // ok
    // ttt
    getData = () => {
      return cloneDeep(this.#data);
    };

    // ok
    // ttt
    getCheckboxData = () => {
      return cloneDeep(this.#checkboxData);
    };

    // ok
    // ttt
    getRadioData = () => {
      return cloneDeep(this.#radioData);
    };

    // ttt
    getAddedData = () => {
      return cloneDeep(this.#addedData);
    };

    // ttt
    getOriginData = () => {
      return cloneDeep(this.#originalData);
    };

    // ttt
    getRemovedData = () => {
      return cloneDeep(this.#removedData);
    };

    // ttt
    getUpdatedData = () => {
      return cloneDeep(this.#updatedData);
    };

    getEdit = () => {
      return this.#schema.edit;
    };

    // ok
    // ttt
    upRow = (index) => {
      if (index < 1) return;
      const target = this.#data[index];
      this.#data[index] = this.#data[index - 1];
      this.#data[index - 1] = target;
      this.#renderBody?.();
    };

    // ok
    // ttt
    downRow = (index) => {
      if (index + 1 > this.#data.length - 1) return;
      const target = this.#data[index];
      this.#data[index] = this.#data[index + 1];
      this.#data[index + 1] = target;
      this.#renderBody?.();
    };

    // ttt
    setSort = (key) => {
      if (key) {
        this.#schema.sort = key;
      } else {
        delete this.#schema.sort;
      }
      this.#renderBody?.();

      // if (sort) {
      //   data.sort((a, b) => b[sort] - a[sort]);
      // }
    };

    // ttt
    setGroup = (key) => {
      if (key) {
        this.#schema.group = key;
      } else {
        delete this.#schema.group;
      }
      this.#renderBody?.();
    };

    // ttt
    setOnPageChange = (callback) => {
      if (!(typeof callback === "function")) return;
      this.#onPageChange = callback;
    };

    // ttt
    setOnSizeChange = (callback) => {
      if (!(typeof callback === "function")) return;
      this.#onSizeChange = callback;
    };

    // ttt
    setRenderer = (renderer) => {
      // 렌더러 검증 로직 필요
      this.#renderer = renderer;
    };
  })();

  return { ..._useGrid.current, ...method };
};
