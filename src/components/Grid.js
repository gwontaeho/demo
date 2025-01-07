import {
  useRef,
  useReducer,
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
  useMemo,
  memo,
  useCallback,
} from "react";
import utils from "../utils";

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

import { ControlText } from "./ControlText";
import { ControlNumber } from "./ControlNumber";
import { ControlRadio } from "./ControlRadio";
import { ControlCheckbox } from "./ControlCheckbox";
import { ControlSelect } from "./ControlSelect";
import { ControlTextarea } from "./ControlTextarea";
import { ControlDate } from "./ControlDate";

const GridContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "RENDER": {
      return { ...state };
    }
    case "SET_SCROLL": {
      return { ...state, ...action.payload };
    }
    case "SET_HEADER": {
      return { ...state, ...makeHeader(action.payload) };
    }
    case "SET_DATA": {
      return { ...state, data: action.payload, page: 0, size: 10 };
    }
    case "SET_DATA_ITEM_BINDING": {
      const { nextValue, binding, dataIndex } = action.payload;
      const nextData = [...state.data];
      nextData[dataIndex][binding] = nextValue;
      return { ...state, data: nextData };
    }
    case "SET_PAGE": {
      return { ...state, page: action.payload };
    }
    case "SET_SIZE": {
      return { ...state, size: action.payload, page: 0 };
    }
  }
};

const makeHeader = (schema) => {
  const { header, checkbox, radio } = schema;
  const { headerSchema, headerWidths, headerRowCount } = cloneDeep(
    header
  ).reduce(
    (prev, curr) => {
      curr.colCount ||= 1;
      curr.rowCount ||= 1;
      const { colWidths } = curr.cells.reduce(
        (item, cell) => {
          cell.colSpan ||= 1;
          cell.rowSpan ||= 1;
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
      prev.headerSchema = prev.headerSchema.concat(curr);
      prev.headerWidths = prev.headerWidths.concat(colWidths);
      prev.headerRowCount < curr.rowCount &&
        (prev.headerRowCount = curr.rowCount);
      return prev;
    },
    { headerSchema: [], headerWidths: [], headerRowCount: 0 }
  );
  for (let i = 0; i < checkbox + radio; i++) {
    headerWidths.unshift("40px");
  }
  return { headerSchema, headerWidths, headerRowCount };
};

const makeBody = (schema) => {
  const { body, edit } = schema;
  return cloneDeep(body).reduce(
    (prev, curr) => {
      curr.colCount ||= 1;
      curr.rowCount ||= 1;
      curr.cells.forEach((item) => {
        item.colSpan ||= 1;
        item.rowSpan ||= 1;
        item.edit = item.edit !== undefined ? Boolean(item.edit) : edit;
      });
      prev.bodySchema = prev.bodySchema.concat(curr);
      prev.bodyRowCount < curr.rowCount && (prev.bodyRowCount = curr.rowCount);
      return prev;
    },
    { bodySchema: [], bodyRowCount: 0 }
  );
};

const initializer = ($useGrid) => {
  const { height, checkbox, radio } = $useGrid.defaultSchema;

  const { headerSchema, headerWidths, headerRowCount } = makeHeader(
    $useGrid.defaultSchema
  );

  const { bodySchema, bodyRowCount } = makeBody($useGrid.defaultSchema);

  return {
    data: [],
    height,
    checkbox,
    radio,
    headerSchema,
    headerWidths,
    headerRowCount,
    bodySchema,
    bodyRowCount,
    page: 0,
    size: 10,
  };
};

export const Grid = (props) => {
  const { $useGrid } = props;

  const $ = useRef({
    gridRef: null,
    rowStyles: [],
    startIndex: 0,
    endIndex: 40,
    overscanCount: 10,
  });

  const [state, dispatch] = useReducer(reducer, $useGrid, initializer);

  useEffect(() => {
    $useGrid.dispatch = dispatch;
  }, []);

  const {
    height,
    radio,
    checkbox,
    // header
    headerSchema,
    headerWidths,
    headerRowCount,
    // body
    data,
    page,
    size,
  } = state;

  const render = useCallback(
    throttle(() => {
      dispatch({ type: "RENDER" });
    }, 200),
    []
  );

  const handleScroll = useCallback(
    throttle((event) => {
      const topIndex = $.current.rowStyles.findIndex(({ top, height }) => {
        return event.target.scrollTop < top + height;
      });
      const startIndex = Math.max(topIndex - $.current.overscanCount, 0);
      const endIndex = Math.min(
        topIndex +
          Math.ceil($.current.gridRef.getBoundingClientRect().height / 40) +
          $.current.overscanCount,
        $useGrid.data.length
      );
      $.current.startIndex = startIndex;
      $.current.endIndex = endIndex;
      dispatch({ type: "RENDER" });
    }, 200),
    []
  );

  const ref = (ref) => {
    if (!ref) return;
    $.current.gridRef = ref;
  };

  console.log($.current.startIndex, $.current.endIndex);

  return (
    <GridContext.Provider value={{ $grid: $, $useGrid, state, render }}>
      <div className="flex flex-col" style={{ height }}>
        <div ref={ref} className="flex-1 overflow-auto" onScroll={handleScroll}>
          <Header
            $grid={$}
            radio={radio}
            checkbox={checkbox}
            headerSchema={headerSchema}
            headerWidths={headerWidths}
            headerRowCount={headerRowCount}
          />
          <Body
            $grid={$}
            radio={radio}
            checkbox={checkbox}
            data={data}
            page={page}
            size={size}
            height={height}
          />
        </div>
        <Footer />
      </div>
    </GridContext.Provider>
  );
};

const Header = (props) => {
  const { checkbox, radio, headerSchema, headerWidths, headerRowCount } = props;
  const keyBase = useRef(uuid()).current;
  return (
    <div
      className="sticky top-0 w-fit grid border-t border-l bg-gray-100 z-[1]"
      style={{
        gridTemplateColumns: headerWidths.join(" "),
        gridTemplateRows: `repeat(${headerRowCount}, minmax(40px, auto))`,
      }}
    >
      {radio && <OptionCell />}
      {checkbox && <OptionCell />}
      {headerSchema.map((col, colIndex) => {
        const { colCount, cells } = col;
        const key = `${keyBase}-headercol-${colIndex}`;
        return (
          <div
            key={key}
            className="grid grid-cols-subgrid grid-rows-subgrid"
            style={{
              gridColumn: `span ${colCount}`,
              gridRow: `span ${headerRowCount}`,
            }}
          >
            {cells.map((cell, cellIndex) => {
              const { colSpan, rowSpan, binding } = cell;
              const key = `${keyBase}-headercel-${colIndex}-${cellIndex}`;
              return (
                <div
                  key={key}
                  className="min-h-10 border-r border-b flex items-center justify-center"
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                  }}
                >
                  {binding}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const Body = (props) => {
  const { $grid, data, page, size, height } = props;
  const keyBase = useRef(uuid()).current;

  const $ = useRef({ height: 0 });

  const chunked = [];
  const chunkCount = Math.ceil(data.length / size);
  for (let i = 0; i < chunkCount; i++) {
    chunked.push(data.slice(i * size, (i + 1) * size));
  }

  const paged = chunked[page] || [];

  let rows;
  rows = height
    ? paged.slice($grid.current.startIndex, $grid.current.endIndex)
    : paged;

  $grid.current.rowStyles.reduce((prev, curr, index) => {
    curr.top = prev;
    const next = prev + curr.height;
    if (index === size - 1) {
      $.current.height = next;
    }
    return next;
  }, 0);

  if (height !== undefined) {
    $.current.height = undefined;
  }

  console.log(rows);

  return (
    <div className="relative w-fit" style={{ height: $.current.height }}>
      {rows.map((item, index) => {
        const dataIndex = page * size + $grid.current.startIndex + index;
        const viewIndex = $grid.current.startIndex + index;
        const key = `${keyBase}-bodyrow-${dataIndex}`;
        return (
          <Row
            key={key}
            rowKey={key}
            item={item}
            dataIndex={dataIndex}
            viewIndex={viewIndex}
          />
        );
      })}
    </div>
  );
};

const Row = (props) => {
  const { rowKey, item, dataIndex, viewIndex } = props;
  const { $grid, $useGrid, state, render } = useContext(GridContext);
  const { checkbox, radio, headerWidths, bodySchema, bodyRowCount } = state;
  const $ = useRef({ rowRef: null });
  const top = $grid.current.rowStyles[viewIndex]?.top;

  // const [renderCount, setRenderCount] = useState(0)

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!$grid.current.rowStyles[viewIndex]) {
          $grid.current.rowStyles[viewIndex] = {};
        }
        const currHeight = entry.contentRect.height;
        const prevHeight = $grid.current.rowStyles[viewIndex].height;
        if (currHeight !== prevHeight) {
          $grid.current.rowStyles[viewIndex].height = currHeight;
          render();
        }
      }
    });

    observer.observe($.current.rowRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={(ref) => {
        if (!ref) return;
        $.current.rowRef = ref;
      }}
      className={
        "grid absolute border-l" + (top === undefined ? " opacity-0" : "")
      }
      style={{
        top,
        gridTemplateColumns: headerWidths.join(" "),
        gridTemplateRows: `repeat(${bodyRowCount}, minmax(40px, auto))`,
      }}
    >
      {radio && (
        <OptionCell>
          <input type="radio" />
        </OptionCell>
      )}
      {checkbox && (
        <OptionCell>
          <input type="checkbox" />
        </OptionCell>
      )}
      {bodySchema.map((col, colIndex) => {
        const { colCount, cells } = col;
        const key = `${rowKey}-bodycol-${colIndex}`;
        return (
          <div
            key={key}
            className="grid grid-cols-subgrid grid-rows-subgrid"
            style={{
              gridColumn: `span ${colCount}`,
              gridRow: `span ${bodyRowCount}`,
            }}
          >
            {cells.map((cell, cellIndex) => {
              const { colSpan, rowSpan, binding, ...rest } = cell;
              const key = `${rowKey}-bodycel-${colIndex}-${cellIndex}`;
              return (
                <div
                  key={key}
                  className="min-h-10 border-r border-b flex items-center p-1"
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                  }}
                >
                  <Control
                    {...rest}
                    $useGrid={$useGrid}
                    value={item[binding]}
                    binding={binding}
                    dataIndex={dataIndex}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const Control = (props) => {
  const { $useGrid, type, edit, value, dataIndex, binding, ...rest } = props;

  if (edit === false) {
    let formatted = value;
    if (type === "checkbox") {
      if (Array.isArray(formatted)) {
        formatted = formatted.join(", ");
      }
    } else if (type === "date") {
      if (formatted instanceof Date) {
        formatted = `${formatted.getFullYear()}-${
          formatted.getMonth() + 1 > 9 ? "" : "0"
        }${formatted.getMonth() + 1}-${
          formatted.getDate() > 9 ? "" : "0"
        }${formatted.getDate()}`;
      }
    }
    return <div>{formatted}</div>;
  }

  rest.value = value;
  rest.onChange = (event) => {
    const eventValue = event.target.value;
    const eventChecked = event.target.checked;

    let nextValue;
    if (type === "checkbox") {
      nextValue = value || [];
      if (eventChecked) nextValue = [...nextValue, eventValue];
      else nextValue = nextValue.filter((item) => item !== eventValue);
    } else if (type === "date") {
      if (event instanceof Date || event === null) nextValue = event;
      else nextValue = eventValue;
    } else {
      nextValue = eventValue;
    }

    $useGrid.dispatch({
      type: "SET_DATA_ITEM_BINDING",
      payload: { nextValue, binding, dataIndex },
    });
  };

  return (
    <div className="w-full [&>*]:w-full">
      {type === "text" ? (
        <ControlText {...rest} />
      ) : type === "number" ? (
        <ControlNumber {...rest} />
      ) : type === "select" ? (
        <ControlSelect {...rest} />
      ) : type === "radio" ? (
        <ControlRadio {...rest} />
      ) : type === "checkbox" ? (
        <ControlCheckbox {...rest} />
      ) : type === "textarea" ? (
        <ControlTextarea {...rest} />
      ) : type === "date" ? (
        <ControlDate {...rest} />
      ) : null}
    </div>
  );
};

const Footer = () => {
  const { $useGrid, state } = useContext(GridContext);
  const { page, size, data } = state;

  const handleChangePage = (payload) => {
    $useGrid.dispatch({ type: "SET_PAGE", payload });
  };
  const handleChangeSize = (payload) => {
    $useGrid.dispatch({ type: "SET_SIZE", payload });
  };

  return (
    <div className="h-12 bg-gray-100 px-2 flex items-center gap-8">
      <Sizination size={size} onChange={handleChangeSize} />
      <Pagination
        page={page}
        perPage={size}
        count={data.length}
        onChange={handleChangePage}
      />
    </div>
  );
};

const Pagination = (props) => {
  const { page, count = 0, perPage = 10, chunk = 10, onChange } = props;
  const uuid = useRef(utils.uuid()).current;
  const [cursor, setCursor] = useState(0);
  const chunked = [];
  const pageCount = Math.ceil(count / perPage);
  const chunkCount = Math.ceil(pageCount / chunk);
  const pages = [...new Array(pageCount).keys()];
  for (let i = 0; i < chunkCount; i++)
    chunked.push(pages.slice(i * chunk, (i + 1) * chunk));
  const list = chunked[cursor];

  const handleClickPrev = () => {
    if (cursor > 0) {
      setCursor((prev) => (prev -= 1));
    }
  };
  const handleClickNext = () => {
    if (cursor < chunkCount - 1) {
      setCursor((prev) => (prev += 1));
    }
  };
  const handleClickPage = (value) => {
    onChange?.(value);
  };

  useEffect(() => {
    if (cursor !== 0) {
      setCursor(0);
    }
  }, [chunkCount]);

  return (
    <div className="flex gap-1">
      <button
        type="button"
        className="text-sm border rounded w-8 h-8"
        onClick={handleClickPrev}
      >{`<`}</button>
      {list?.map((value) => {
        const key = `${uuid}-pagination-${value}`;
        return (
          <button
            key={key}
            type="button"
            className={
              "text-sm border rounded w-8 h-8" +
              (page === value ? " font-semibold" : "")
            }
            onClick={() => handleClickPage(value)}
          >
            {value + 1}
          </button>
        );
      })}
      <button
        type="button"
        className="text-sm border rounded w-8 h-8"
        onClick={handleClickNext}
      >{`>`}</button>
    </div>
  );
};

const Sizination = (props) => {
  const { onChange } = props;
  const uuid = useRef(utils.uuid()).current;
  const list = [10, 20, 30, 40, 50, 100];
  const handleChange = (event) => {
    onChange?.(event.target.value);
  };
  return (
    <select className="h-8 w-20 rounded border text-sm" onChange={handleChange}>
      {list.map((value) => {
        const key = `${uuid}-sizination-${value}`;
        return (
          <option key={key} value={value}>
            {value}
          </option>
        );
      })}
    </select>
  );
};

const OptionCell = ({ children }) => {
  return (
    <div className="border-r border-b row-span-full flex items-center justify-center">
      {children}
    </div>
  );
};
