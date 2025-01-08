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

import { ControlText } from "./ControlText";
import { ControlNumber } from "./ControlNumber";
import { ControlRadio } from "./ControlRadio";
import { ControlCheckbox } from "./ControlCheckbox";
import { ControlSelect } from "./ControlSelect";
import { ControlTextarea } from "./ControlTextarea";
import { ControlDate } from "./ControlDate";

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

const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

const clone = (item) => {
  if (item === null || typeof item !== "object") {
    return item;
  }
  if (Array.isArray(item)) {
    return [...item];
  }
  return { ...item };
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

const makeSchema = (schema) => {
  const { height, radio, checkbox, page = 0, size = 10 } = schema;
  const { headerSchema, headerWidths, headerRowCount } = makeHeader(schema);
  const { bodySchema, bodyRowCount } = makeBody(schema);
  return {
    height,
    radio,
    checkbox,
    page,
    size,
    headerSchema,
    headerWidths,
    headerRowCount,
    bodySchema,
    bodyRowCount,
  };
};

const GridContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SCHEMA": {
      return { ...state, ...makeSchema(action.payload) };
    }
    case "SET_HEADER": {
      return { ...state, ...makeHeader(action.payload) };
    }
    case "SET_BODY": {
      return { ...state, ...makeBody(action.payload) };
    }
    case "ADD_ROW": {
      return { ...state, data: clone(action.payload) };
    }
    case "REMOVE_ROW": {
      return { ...state, data: clone(action.payload) };
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

const initializer = ($useGrid) => {
  const { schema, data } = $useGrid;
  return {
    data: cloneDeep(data),
    ...makeSchema(schema),
  };
};

export const Grid = (props) => {
  const { $useGrid } = props;
  const $ = useRef({
    keyBase: uuid(),
    listRef: null,
    rowStyles: [],
    startIndex: 0,
    endIndex: 40,
    overscanCount: 40,
  });
  const [
    {
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
      bodySchema,
      bodyRowCount,
    },
    dispatch,
  ] = useReducer(reducer, $useGrid, initializer);

  const ref = (ref) => {
    if (!ref) return;
    $.current.listRef = ref;
  };

  useLayoutEffect(() => {
    $useGrid.dispatch = dispatch;
  }, []);

  return (
    <GridContext.Provider value={{ $grid: $, $useGrid }}>
      <div className="flex flex-col" style={{ height }}>
        <div ref={ref} className="flex-1 overflow-auto">
          <Header
            radio={radio}
            checkbox={checkbox}
            headerSchema={headerSchema}
            headerWidths={headerWidths}
            headerRowCount={headerRowCount}
          />
          <Body
            radio={radio}
            checkbox={checkbox}
            data={data}
            page={page}
            size={size}
            height={height}
            bodySchema={bodySchema}
            bodyRowCount={bodyRowCount}
            headerWidths={headerWidths}
          />
        </div>
        <Footer page={page} size={size} data={data} />
      </div>
    </GridContext.Provider>
  );
};

const Body = memo(
  (props) => {
    const {
      data,
      page,
      size,
      height,
      radio,
      checkbox,
      bodySchema,
      bodyRowCount,
      headerWidths,
    } = props;
    const { $grid, $useGrid } = useContext(GridContext);
    const [, setRenderCount] = useState(0);

    const renderBody = useCallback(
      throttle(() => {
        setRenderCount((prev) => ++prev);
      }, 200),
      []
    );

    // const renderBody = () => setRenderCount((prev) => ++prev);

    useEffect(() => {
      const handleScroll = (event) => {
        const topIndex = $grid.current.rowStyles.findIndex(
          ({ top, height }) => {
            return event.target.scrollTop < top + height;
          }
        );
        const startIndex = Math.max(topIndex - $grid.current.overscanCount, 0);
        const endIndex = Math.min(
          topIndex +
            Math.ceil(event.target.getBoundingClientRect().height / 40) +
            $grid.current.overscanCount,
          $useGrid.data.length
        );
        $grid.current.startIndex = startIndex;
        $grid.current.endIndex = endIndex;
        renderBody();
      };

      $grid.current.listRef.addEventListener("scroll", handleScroll);

      return () => {
        $grid.current.listRef.removeEventListener("scroll", handleScroll);
      };
    }, []);

    const chunked = [];
    const chunkCount = Math.ceil(data.length / size);
    for (let i = 0; i < chunkCount; i++) {
      chunked.push(data.slice(i * size, (i + 1) * size));
    }

    const paged = chunked[page] || [];
    const rows = height
      ? paged.slice($grid.current.startIndex, $grid.current.endIndex)
      : paged;

    const bodyHeight = $grid.current.rowStyles.reduce((prev, curr) => {
      curr.top = prev;
      return prev + curr.height;
    }, 0);

    return (
      <div className="relative w-fit" style={{ height: bodyHeight }}>
        {rows.map((item, index) => {
          const dataIndex = page * size + $grid.current.startIndex + index;
          const viewIndex = $grid.current.startIndex + index;
          const key = `${$grid.current.keyBase}-bodyrow-${dataIndex}`;
          return (
            <Row
              key={key}
              rowKey={key}
              item={item}
              dataIndex={dataIndex}
              viewIndex={viewIndex}
              radio={radio}
              checkbox={checkbox}
              bodySchema={bodySchema}
              bodyRowCount={bodyRowCount}
              headerWidths={headerWidths}
              renderBody={renderBody}
            />
          );
        })}
      </div>
    );
  },
  (prevProps, nextProps) => {
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    return (
      prevKeys.length === nextKeys.length &&
      prevKeys.every((key) => {
        return (
          nextProps.hasOwnProperty(key) === true &&
          prevProps[key] === nextProps[key]
        );
      })
    );
  }
);

const Row = (props) => {
  const {
    rowKey,
    item,
    dataIndex,
    viewIndex,
    radio,
    checkbox,
    headerWidths,
    bodySchema,
    bodyRowCount,
    renderBody,
  } = props;
  const { $grid, $useGrid } = useContext(GridContext);

  const $ = useRef({ rowRef: null });
  const top = $grid.current.rowStyles[viewIndex]?.top;

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
          renderBody();
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
          {dataIndex}
          {/* <input type="radio" /> */}
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

  rest.value = value || "";
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

const Header = memo(
  (props) => {
    const { checkbox, radio, headerSchema, headerWidths, headerRowCount } =
      props;
    const { $grid } = useContext(GridContext);

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
          const colKey = `${$grid.current.keyBase}-headercol-${colIndex}`;
          return (
            <div
              key={colKey}
              className="grid grid-cols-subgrid grid-rows-subgrid"
              style={{
                gridColumn: `span ${colCount}`,
                gridRow: `span ${headerRowCount}`,
              }}
            >
              {cells.map((cell, cellIndex) => {
                const { colSpan, rowSpan, binding } = cell;
                const celKey = `${colKey}-headercel-${cellIndex}`;
                return (
                  <div
                    key={celKey}
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
  },
  (prevProps, nextProps) => {
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);

    if (
      !(
        prevKeys.length === nextKeys.length &&
        prevKeys.every((key) => {
          return (
            nextProps.hasOwnProperty(key) === true &&
            prevProps[key] === nextProps[key]
          );
        })
      )
    ) {
      console.log("render header");
    }

    return (
      prevKeys.length === nextKeys.length &&
      prevKeys.every((key) => {
        return (
          nextProps.hasOwnProperty(key) === true &&
          prevProps[key] === nextProps[key]
        );
      })
    );
  }
);

const Footer = (props) => {
  const { page, size, data } = props;
  const { $grid, $useGrid } = useContext(GridContext);

  const handleChangePage = (payload) => {
    $grid.current.listRef.scrollTop = 0;
    $useGrid.dispatch({ type: "SET_PAGE", payload });
  };
  const handleChangeSize = (payload) => {
    $useGrid.dispatch({ type: "SET_SIZE", payload });
  };

  return (
    <div className="min-h-12 bg-gray-100 px-2 flex items-center gap-8">
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
  const pageCount = Math.ceil(count / perPage) || 1;
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

  const isOverPage = pageCount < page + 1;

  useEffect(() => {
    if (isOverPage) {
      handleClickPage(page - 1);
    }
  }, [isOverPage]);

  const isOverCursor = chunkCount < cursor + 1;

  useEffect(() => {
    if (isOverCursor) {
      setCursor((prev) => prev - 1);
    }
  }, [isOverCursor]);

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
  const list = [10, 20, 30, 40, 50, 100, 1000];
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
