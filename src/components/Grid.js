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
    case "RENDER":
      return { ...state };
    case "SET_DATA":
      return { ...state, data: action.payload, page: 0, size: 10 };
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

const makeHeader = () => {};

const initializer = ($useGrid) => {
  const { edit, height, checkbox, radio, header, body } =
    $useGrid.defaultSchema;

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
          item.span += cell.colSpan;
          if (cell.width && cell.colSpan === 1)
            item.colWidths[item.span - 1] = cell.width;
          if (item.span >= curr.colCount) item.span = 0;
          return item;
        },
        { colWidths: new Array(curr.colCount).fill("200px"), span: 0 }
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

  const { bodySchema, bodyRowCount } = cloneDeep(body).reduce(
    (prev, curr) => {
      curr.colCount ||= 1;
      curr.rowCount ||= 1;
      curr.cells.forEach((item) => {
        item.edit = typeof item.edit === "boolean" ? item.edit : edit;
      });
      prev.bodySchema = prev.bodySchema.concat(curr);
      prev.bodyRowCount < curr.rowCount && (prev.bodyRowCount = curr.rowCount);
      return prev;
    },
    { bodySchema: [], bodyRowCount: 0 }
  );

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
    uuid: utils.uuid(),
    gridRef: null,
    rowStyles: [],
    startIndex: 0,
    endIndex: 40,
    overscanCount: 40,
  });

  const [state, dispatch] = useReducer(reducer, $useGrid, initializer);

  useEffect(() => {
    $useGrid.dispatch = dispatch;
  }, []);

  const { height } = state;

  const render = useCallback(
    utils.throttle(() => {
      dispatch({ type: "RENDER" });
    }, 200),
    []
  );

  const handleScroll = useCallback(
    utils.throttle((event) => {
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

  return (
    <GridContext.Provider value={{ $grid: $, $useGrid, state, render }}>
      <div className="flex flex-col" style={{ height }}>
        <div ref={ref} className="flex-1 overflow-auto" onScroll={handleScroll}>
          <Header />
          <Body />
        </div>
        <Footer />
      </div>
    </GridContext.Provider>
  );
};

const Header = memo(() => {
  const { state } = useContext(GridContext);
  const { checkbox, radio, headerSchema, headerWidths, headerRowCount } = state;
  const uuid = useRef(utils.uuid()).current;

  return (
    <div
      className="sticky top-0 grid w-fit border-t border-l bg-gray-100 z-[1]"
      style={{
        gridTemplateColumns: headerWidths.join(" "),
        gridTemplateRows: `repeat(${headerRowCount}, minmax(0, 1fr))`,
      }}
    >
      {radio && <div className="border-r border-b row-span-full"></div>}
      {checkbox && <div className="border-r border-b row-span-full"></div>}
      {headerSchema.map((col, colIndex) => {
        const { colCount, rowCount, cells } = col;
        const key = `${uuid}-header-col-${colIndex}`;
        return (
          <div
            key={key}
            className="grid grid-cols-subgrid grid-rows-subgrid"
            style={{
              gridColumn: `span ${colCount}`,
              gridRow: `span ${rowCount}`,
            }}
          >
            {cells.map((cell, cellIndex) => {
              const { colSpan = 1, rowSpan = 1, binding } = cell;
              const key = `${uuid}-header-cel-${colIndex}-${cellIndex}`;
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
});

const Body = () => {
  const { $grid, state } = useContext(GridContext);
  const { data, page, size, height } = state;

  const $ = useRef({ height: 0 });

  const startIndex = $grid.current.startIndex;
  const endIndex = $grid.current.endIndex;

  const chunked = [];
  const chunkCount = Math.ceil(data.length / size);
  for (let i = 0; i < chunkCount; i++) {
    chunked.push(data.slice(i * size, (i + 1) * size));
  }

  const paged = chunked[page] || [];

  let rows;
  rows = height ? paged.slice(startIndex, endIndex) : paged;

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

  return (
    <div className="relative w-fit" style={{ height: $.current.height }}>
      {rows.map((item, index) => {
        const dataIndex = page * size + startIndex + index;
        const viewIndex = startIndex + index;
        const key = `${$grid.current.uuid}-body-item-${dataIndex}`;
        return (
          <Row
            key={key}
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
  const { item, dataIndex, viewIndex } = props;
  const { $grid, $useGrid, state, render } = useContext(GridContext);
  const { checkbox, radio, headerWidths, bodySchema, bodyRowCount } = state;
  const $ = useRef({ rowRef: null });
  const top = $grid.current.rowStyles[viewIndex]?.top;

  const refCallback = useCallback((element) => {
    if (element) $.current.rowRef = element;
  }, []);

  useLayoutEffect(() => {
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
      ref={refCallback}
      className={
        "grid absolute border-l" + (top === undefined ? " opacity-0" : "")
      }
      style={{
        top,
        gridTemplateColumns: headerWidths.join(" "),
        gridTemplateRows: `repeat(${bodyRowCount}, minmax(0, 1fr))`,
      }}
    >
      {radio && (
        <div className="border-r border-b row-span-full flex items-center justify-center">
          <input type="radio" />
        </div>
      )}
      {checkbox && (
        <div className="border-r border-b row-span-full flex items-center justify-center">
          <input type="checkbox" />
        </div>
      )}
      {bodySchema.map((col, colIndex) => {
        const { colCount, rowCount, cells } = col;
        const key = `${$grid.current.uuid}-body-col-${dataIndex}-${colIndex}`;
        return (
          <div
            key={key}
            className="grid grid-cols-subgrid grid-rows-subgrid"
            style={{
              gridColumn: `span ${colCount}`,
              gridRow: `span ${rowCount}`,
            }}
          >
            {cells.map((cell, cellIndex) => {
              const { colSpan = 1, rowSpan = 1, binding, ...rest } = cell;
              const key = `${$grid.current.uuid}-body-cel-${dataIndex}-${colIndex}-${cellIndex}`;
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
