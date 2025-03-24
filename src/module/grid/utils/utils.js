const uuid = () => {
  // return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
  //   const random = (Math.random() * 16) | 0;
  //   const value = char === "x" ? random : (random & 0x3) | 0x8;
  //   return value.toString(16);
  // });
  return crypto.randomUUID();
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

const deepEqual = (a, b) => {
  if (a === b) return true;
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return a === b;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (let key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !deepEqual(a[key], b[key])
    ) {
      return false;
    }
  }
  return true;
};

const throttle = (func, delay) => {
  let timer;
  return (...args) => {
    if (!timer) {
      timer = setTimeout(() => {
        func(...args);
        timer = undefined;
      }, delay);
    }
  };
};

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const makeHeader = (schema) => {
  const { index, radio, checkbox, header } = schema;
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
  for (let i = 0; i < checkbox + radio + index; i++) {
    headerWidths.unshift("32px");
  }
  return { headerWidths, headerRowCount };
};

const makeBody = (schema) => {
  const { index, radio, checkbox, editable, body, header } = schema;
  const { bodyWidths, bodyRowCount } = body.reduce(
    (prev, curr, index) => {
      curr.visible = header?.[index].visible ?? true;
      curr.colCount ??= 1;
      curr.rowCount ??= 1;

      const { colWidths } = curr.cells.reduce(
        (item, cell) => {
          cell.colSpan ??= 1;
          cell.rowSpan ??= 1;
          cell.editable = editable;
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
      prev.bodyWidths = prev.bodyWidths.concat(colWidths);
      prev.bodyRowCount < curr.rowCount && (prev.bodyRowCount = curr.rowCount);
      return prev;
    },
    { bodyWidths: [], bodyRowCount: 0 }
  );
  for (let i = 0; i < checkbox + radio + index; i++) {
    bodyWidths.unshift("32px");
  }
  return { bodyWidths, bodyRowCount };
};

const makeSchema = (schema) => {
  schema.editable ??= false;
  schema.index ??= false;
  schema.radio ??= false;
  schema.checkbox ??= false;
  schema.page ??= 0;
  schema.size ??= 10;

  const header = schema.header;
  const body = schema.body;

  const { headerWidths, headerRowCount } = header ? makeHeader(schema) : {};
  const { bodyWidths, bodyRowCount } = body ? makeBody(schema) : {};

  schema.headerWidths = headerWidths;
  schema.headerRowCount = headerRowCount;
  schema.bodyWidths = bodyWidths;
  schema.bodyRowCount = bodyRowCount;
  return schema;
};

export {
  uuid,
  cloneDeep,
  deepEqual,
  debounce,
  throttle,
  makeHeader,
  makeBody,
  makeSchema,
};
