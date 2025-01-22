import {
  useRef,
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
  useMemo,
  memo,
  useCallback,
} from "react";

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
      if (curr.show === false) return prev;
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
  for (let i = 0; i < (checkbox ?? 0) + (radio ?? 0); i++) {
    headerWidths.unshift("32px");
  }
  return { headerSchema, headerWidths, headerRowCount };
};

const makeBody = (schema) => {
  const { body, header, edit } = schema;
  const { bodySchema, bodyRowCount } = cloneDeep(body).reduce(
    (prev, curr, index) => {
      if (header[index].show === false) return prev;
      curr.colCount ||= 1;
      curr.rowCount ||= 1;
      curr.cells.forEach((item) => {
        item.colSpan ||= 1;
        item.rowSpan ||= 1;
        item.edit = Boolean(item.edit ?? curr.edit ?? edit);
      });
      prev.bodySchema = prev.bodySchema.concat(curr);
      prev.bodyRowCount < curr.rowCount && (prev.bodyRowCount = curr.rowCount);
      return prev;
    },
    { bodySchema: [], bodyRowCount: 0 }
  );
  return { bodySchema, bodyRowCount };
};

const GridContext = createContext();

const GridContextProvider = (props) => {
  const { children, $useGrid } = props;

  const $ = useRef({
    keyBase: uuid(),
    listRef: null,
    rowStyles: { true: [], false: [] },
  }).current;

  const contextValue = useMemo(() => {
    return { $grid: $, $useGrid };
  }, []);

  return (
    <GridContext.Provider value={contextValue}>{children}</GridContext.Provider>
  );
};

const GridComponent = memo(() => {
  console.log("Grid Component");
  const [, setRenderCount] = useState(0);
  const { $grid, $useGrid } = useContext(GridContext);
  const { schema } = $useGrid;
  const { height, pagination } = schema;

  const handleScroll = useCallback(
    throttle(() => {
      $useGrid.renderBody?.();
    }, 100),
    []
  );

  useLayoutEffect(() => {
    $useGrid.renderGrid = () => {
      setRenderCount((prev) => ++prev);
    };
    return () => {
      $useGrid.renderGrid = null;
    };
  }, []);

  return (
    <div className="w-full">
      <div
        ref={(ref) => {
          if (!ref) return;
          $grid.listRef = ref;
        }}
        className="w-full overflow-auto text-[14px]"
        style={{ height }}
        onScroll={handleScroll}
      >
        <Header />
        <Body />
      </div>
      {pagination && <Footer />}
    </div>
  );
});

const Header = memo(() => {
  console.log("Grid Header");
  const [, setRenderCount] = useState(0);
  const { $grid, $useGrid } = useContext(GridContext);
  const { schema } = $useGrid;
  const { radio, checkbox } = schema;
  const { headerSchema, headerRowCount, headerWidths } = makeHeader(schema);
  useLayoutEffect(() => {
    $useGrid.renderHeader = () => {
      setRenderCount((prev) => ++prev);
    };
    return () => {
      $useGrid.renderHeader = null;
    };
  }, []);
  return (
    <div
      className="sticky top-0 min-w-fit grid border-t border-l bg-gray-100 z-[1]"
      style={{
        gridTemplateColumns: headerWidths.join(" "),
        gridTemplateRows: `repeat(${headerRowCount}, minmax(32px, auto))`,
      }}
    >
      {radio && <OptionCell />}
      {checkbox && <OptionCell />}
      {headerSchema.map((col, colIndex) => {
        const { colCount, cells } = col;
        const colKey = `${$grid.keyBase}-headercol-${colIndex}`;
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
                  className="border-r border-b flex items-center justify-center"
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

const Body = memo(() => {
  console.log("Grid Body");
  const [, setRenderCount] = useState(0);
  const { $grid, $useGrid } = useContext(GridContext);
  const { schema, data, dataCount } = $useGrid;
  const { page, size, height, edit, sort, group, pagination } = schema;
  const { headerWidths } = makeHeader(schema);
  const { bodySchema, bodyRowCount } = makeBody(schema);

  const readjust = useCallback(
    debounce(() => {
      console.log("adjust");
      $grid.rowStyles[$useGrid.schema.edit]
        .slice(0, $useGrid.schema.pagination ? $useGrid.schema.size : undefined)
        .reduce((prev, curr) => {
          curr.top = prev;
          return prev + curr.height;
        }, 0);
      setRenderCount((prev) => ++prev);
    }, 100),
    []
  );

  useLayoutEffect(() => {
    $useGrid.renderBody = () => {
      setRenderCount((prev) => ++prev);
    };
    return () => {
      $useGrid.renderBody = null;
    };
  }, []);

  if (sort) {
    data.sort((a, b) => b[sort] - a[sort]);
  }

  // if (group) {
  //   const grouped = data.reduce((prev, curr) => {
  //     const key = curr[group];
  //     if (!prev[key]) {
  //       prev[key] = [];
  //     }
  //     prev[key].push(curr);
  //     return prev;
  //   }, {});

  //   console.log(Object.values(grouped));
  // }

  let rows;
  let indexStart = 0;
  const paged =
    pagination === true
      ? [...Array(Math.ceil(dataCount / size)).keys()].map((curr) => {
          return data.slice(curr * size, (curr + 1) * size);
        })[page] || []
      : data;

  if (height !== undefined) {
    const overscanCount = 40;
    const rowMinHeight = 32;
    const heightNumber = Number(
      String(height).replaceAll(" ", "").replace("px", "")
    );
    const scrollTop = $grid.listRef?.scrollTop || 0;
    const indexTop = Math.max(
      $grid.rowStyles[edit].findIndex(({ top }) => scrollTop <= top),
      0
    );
    indexStart = Math.max(indexTop - overscanCount, 0);
    // 실제 행 높이로 계산하는 로직 추가해야함.
    const indexEnd = Math.min(
      indexTop + Math.ceil(heightNumber / rowMinHeight) + overscanCount,
      paged.length
    );
    rows = paged.slice(indexStart, indexEnd);
  } else {
    rows = paged;
  }

  return (
    <div className="relative">
      {rows.map((_, rowIndex) => {
        const viewIndex = indexStart + rowIndex;
        const dataIndex = viewIndex + (pagination === true ? page * size : 0);
        const key = `${$useGrid.keyBase}-bodyrow-${dataIndex}`;
        return (
          <Row
            key={key}
            rowKey={key}
            dataIndex={dataIndex}
            viewIndex={viewIndex}
            headerWidths={headerWidths}
            bodySchema={bodySchema}
            bodyRowCount={bodyRowCount}
            readjust={readjust}
          />
        );
      })}
    </div>
  );
});

const Row = (props) => {
  const {
    rowKey,
    dataIndex,
    viewIndex,
    headerWidths,
    bodySchema,
    bodyRowCount,
    readjust,
  } = props;

  const $ = useRef({ rowRef: null, observer: null }).current;
  const { $grid, $useGrid } = useContext(GridContext);
  const [, setRenderCount] = useState(0);
  const { schema, data, radioData, checkboxData } = $useGrid;
  const { height, radio, checkbox, edit } = schema;
  const rowData = data[dataIndex];
  const top = $grid.rowStyles[edit][viewIndex]?.top;

  const renderRow = () => {
    setRenderCount((prev) => ++prev);
  };

  const setData = (param) => {
    const nextData = cloneDeep(
      param instanceof Function ? param(cloneDeep(rowData)) : param
    );
    for (const key in rowData) {
      if (rowData.hasOwnProperty(key)) {
        delete rowData[key];
      }
    }
    for (const key in nextData) {
      rowData[key] = nextData[key];
    }
    renderRow();
  };

  const handleRadio = () => {
    $useGrid.radioData = rowData;
  };

  const handleCheckbox = () => {
    const checkboxIndex = checkboxData.findIndex((item) => item === rowData);
    if (checkboxIndex === -1) {
      checkboxData.push(rowData);
    } else {
      checkboxData.splice(checkboxIndex, 1);
    }
  };

  useLayoutEffect(() => {
    if (height !== undefined) {
      $.observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const rowStyles = $grid.rowStyles;
          if (!rowStyles[$useGrid.schema.edit][viewIndex]) {
            rowStyles[$useGrid.schema.edit][viewIndex] = {};
          }
          const rowStyle = rowStyles[$useGrid.schema.edit][viewIndex];
          const currHeight = entry.contentRect.height;
          const prevHeight = rowStyle.height;
          if (currHeight !== prevHeight) {
            rowStyle.height = currHeight;
            readjust();
          }
        }
      });
      $.observer.observe($.rowRef);
    }

    return () => {
      if (height !== undefined) {
        $.observer.disconnect();
      }
    };
  }, [height]);

  return (
    <div
      ref={(ref) => {
        if (!ref) return;
        $.rowRef = ref;
      }}
      className={
        "grid border-l" +
        (height !== undefined && top === undefined ? " opacity-0" : "") +
        (height === undefined ? "" : " absolute")
      }
      style={{
        top,
        gridTemplateColumns: headerWidths.join(" "),
        gridTemplateRows: `repeat(${bodyRowCount}, minmax(32px, auto))`,
      }}
    >
      {radio && (
        <OptionCell>
          <input
            name={`${$grid.keyBase}-radio`}
            type="radio"
            defaultChecked={radioData === rowData}
            onChange={handleRadio}
          />
        </OptionCell>
      )}
      {checkbox && (
        <OptionCell>
          <input
            type="checkbox"
            defaultChecked={checkboxData.includes(rowData)}
            onChange={handleCheckbox}
          />
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
              const { id, colSpan, rowSpan, binding, ...rest } = cell;
              const key = `${rowKey}-bodycel-${colIndex}-${cellIndex}`;

              const defaultValue = rowData[binding];
              const renderer = $useGrid.renderer?.body?.[id]?.({
                data: cloneDeep(rowData),
                schema: cloneDeep(cell),
                index: dataIndex,
                setData,
              });

              const onChange = (event) => {
                let nextValue;
                switch (rest.type) {
                  case "checkbox":
                    nextValue = Array.isArray(defaultValue) ? defaultValue : [];
                    if (event.target.checked)
                      nextValue = [...nextValue, event.target.value];
                    else
                      nextValue = nextValue.filter(
                        (item) => item !== event.target.value
                      );
                    break;
                  case "date":
                    if (event instanceof Date || event === null)
                      nextValue = event;
                    else nextValue = event.target.value;
                    break;
                  default:
                    nextValue = event.target.value;
                    break;
                }

                if (!$useGrid.updatedData.includes(rowData)) {
                  $useGrid.updatedData.push(rowData);
                }
                rowData[binding] = nextValue;
                renderRow();
              };

              return (
                <div
                  key={key}
                  className="border-r border-b flex items-center p-1"
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                  }}
                >
                  {renderer ?? (
                    <Control
                      {...rest}
                      defaultValue={defaultValue}
                      onChange={onChange}
                    />
                  )}
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
  const { type, edit, ...rest } = props;

  const controlValue = rest.value || rest.defaultValue;
  const controlText =
    type === "date" && controlValue instanceof Date
      ? `${controlValue.getFullYear()}-${
          controlValue.getMonth() + 1 > 9 ? "" : "0"
        }${controlValue.getMonth() + 1}-${
          controlValue.getDate() > 9 ? "" : "0"
        }${controlValue.getDate()}`
      : type === "checkbox" && Array.isArray(controlValue)
      ? controlValue.join(", ")
      : controlValue;

  if (edit === false) {
    return <div className="max-w-full break-words">{controlText}</div>;
  }

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

const Footer = memo(() => {
  console.log("Grid Footer");
  const [, setRenderCount] = useState(0);
  const { $useGrid } = useContext(GridContext);
  const { schema, dataCount } = $useGrid;
  const { page, size, pagination } = schema;

  useLayoutEffect(() => {
    $useGrid.renderFooter = () => {
      setRenderCount((prev) => ++prev);
    };
    return () => {
      $useGrid.renderFooter = null;
    };
  }, []);

  const handlePageChange = (value) => {
    if (schema.page === value) return;
    $useGrid.schema.page = value;
    if (pagination !== "external") $useGrid.renderBody?.();
    setRenderCount((prev) => ++prev);
    if ($useGrid.onPageChange) {
      $useGrid.onPageChange(value);
    }
  };

  const handleSizeChange = (value) => {
    if (schema.size === value) return;
    $useGrid.schema.page = 0;
    $useGrid.schema.size = value;
    if (pagination !== "external") $useGrid.renderBody?.();
    setRenderCount((prev) => ++prev);
    if ($useGrid.onSizeChange) {
      $useGrid.onSizeChange(value);
    }
  };

  return (
    <div className="min-h-12 bg-gray-100 px-2 flex items-center gap-8">
      <Sizination size={size} onChange={handleSizeChange} />
      <Pagination
        page={page}
        perPage={size}
        count={dataCount}
        onChange={handlePageChange}
      />
    </div>
  );
});

const Pagination = (props) => {
  const { page, count = 0, perPage = 10, chunk = 10, onChange } = props;
  const keyBase = useRef(uuid()).current;
  const [cursor, setCursor] = useState(0);
  const chunked = [];
  const pageCount = Math.ceil(count / perPage) || 1;
  const chunkCount = Math.ceil(pageCount / chunk);
  const pages = [...new Array(pageCount).keys()];
  for (let i = 0; i < chunkCount; i++)
    chunked.push(pages.slice(i * chunk, (i + 1) * chunk));
  const list = chunked[cursor];

  const handlePrevClick = () => {
    if (cursor > 0) {
      setCursor((prev) => (prev -= 1));
    }
  };
  const handleNextClick = () => {
    if (cursor < chunkCount - 1) {
      setCursor((prev) => (prev += 1));
    }
  };
  const handlePageClick = (value) => {
    onChange?.(value);
  };

  const isOverPage = pageCount < page + 1;

  // useEffect(() => {
  //   if (isOverPage) {
  //     handlePageClick(page - 1);
  //   }
  // }, [isOverPage]);

  const isOverCursor = chunkCount < cursor + 1;

  // useEffect(() => {
  //   if (isOverCursor) {
  //     setCursor((prev) => prev - 1);
  //   }
  // }, [isOverCursor]);

  return (
    <div className="flex gap-1">
      <button
        type="button"
        className="text-sm border rounded w-8 h-8"
        onClick={handlePrevClick}
      >{`<`}</button>
      {list?.map((value) => {
        const key = `${keyBase}-pagination-${value}`;
        return (
          <button
            key={key}
            type="button"
            className={
              "text-sm border rounded w-8 h-8" +
              (page === value ? " font-semibold" : "")
            }
            onClick={() => handlePageClick(value)}
          >
            {value + 1}
          </button>
        );
      })}
      <button
        type="button"
        className="text-sm border rounded w-8 h-8"
        onClick={handleNextClick}
      >{`>`}</button>
    </div>
  );
};

const Sizination = (props) => {
  const { size, onChange } = props;
  const keyBase = useRef(uuid()).current;
  const list = [10, 20, 30, 40, 50, 100, 1000];
  const handleChange = (event) => {
    onChange?.(Number(event.target.value));
  };
  return (
    <select
      className="h-8 w-20 rounded border text-sm"
      value={size}
      onChange={handleChange}
    >
      {list.map((value) => {
        const key = `${keyBase}-sizination-${value}`;
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

export const Grid = (props) => {
  return (
    <GridContextProvider {...props}>
      <GridComponent />
    </GridContextProvider>
  );
};
