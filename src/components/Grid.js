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
  useReducer,
} from "react";

import { ControlText } from "./ControlText";
import { ControlNumber } from "./ControlNumber";
import { ControlRadio } from "./ControlRadio";
import { ControlCheckbox } from "./ControlCheckbox";
import { ControlSelect } from "./ControlSelect";
import { ControlTextarea } from "./ControlTextarea";
import { ControlDate } from "./ControlDate";

const GridContext = createContext();

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

const useInitialize = (type) => {
  const { useGrid, grid } = useContext(GridContext);
  const forceUpdate = useReducer(() => ({}))[1];
  useLayoutEffect(() => {
    const deinitializeUseGrid = useGrid.initialize(type, forceUpdate);
    const deinitializeGrid = grid.initialize(type, forceUpdate);
    return () => {
      deinitializeUseGrid();
      deinitializeGrid();
    };
  }, []);
  return { grid, useGrid, forceUpdate };
};

const GridContextProvider = (props) => {
  const { children, useGrid } = props;

  const grid = useRef(
    new (class {
      key = uuid();

      overscanCount = 40;
      rowMinHeight = 32;
      scrollerRef = null;
      rowMetricsEditable = [];
      rowMetricsNonEditable = [];
      renderGrid = null;
      renderHeader = null;
      renderBody = null;
      renderFooter = null;

      initialize = (type, forceUpdate) => {
        switch (type) {
          case "Grid":
            this.renderGrid = forceUpdate;
            return () => {
              this.renderGrid = null;
            };
          case "Header":
            this.renderHeader = forceUpdate;
            return () => {
              this.renderHeader = null;
            };
          case "Body":
            this.renderBody = forceUpdate;
            return () => {
              this.renderBody = null;
            };
          case "Footer":
            this.renderFooter = forceUpdate;
            return () => {
              this.renderFooter = null;
            };
        }
      };

      handleScroll = throttle(() => {
        grid.renderBody?.();
      }, 100);

      scrollerRefCallback = (ref) => {
        this.scrollerRef = ref;
      };

      setRowHeight = (index, height) => {
        const rowMetrics = this.#getRowMetrics();
        const rowMetric = (rowMetrics[index] ??= {});
        if (rowMetric.height === height) {
          return false;
        } else {
          rowMetric.height = height;
          return true;
        }
      };

      readjust = debounce(() => {
        this.#calculateRowTops();
        this.renderBody?.();
      }, 100);

      getRows = () => {
        return this.#index(this.#slice(this.#paginate(useGrid.getData())));
      };

      // ### Private ### //

      #getRowMetrics = () => {
        return useGrid.getEdit()
          ? this.rowMetricsEditable
          : this.rowMetricsNonEditable;
      };

      #calculateRowTops = () => {
        this.#getRowMetrics()
          .slice(0, useGrid.getPagination() ? useGrid.getSize() : undefined)
          .reduce((prev, curr) => {
            curr.top = prev;
            return prev + curr.height;
          }, 0);
      };

      #paginate = (data) => {
        const page = useGrid.getPage();
        const size = useGrid.getSize();
        return !useGrid.getPagination() ||
          useGrid.getPagination() === "external"
          ? data
          : data.slice(page * size, (page + 1) * size);
      };

      #getIndexTop = () => {
        return Math.max(
          this.#getRowMetrics().findIndex(({ top }) => {
            return this.scrollerRef?.scrollTop ?? 0 <= top;
          }),
          0
        );
      };

      #getIndexStart = () => {
        return Math.max(this.#getIndexTop() - this.overscanCount, 0);
      };

      #getIndexEnd = (rowsCount) => {
        const height = Number(
          String(useGrid.getHeight()).replaceAll(" ", "").replace("px", "")
        );
        return Math.min(
          this.#getIndexTop() +
            Math.ceil(height / this.rowMinHeight) +
            this.overscanCount,
          rowsCount
        );
      };

      #slice = (data) => {
        return useGrid.getHeight() === undefined
          ? data
          : data.slice(this.#getIndexStart(), this.#getIndexEnd(data.length));
      };

      #index = (data) => {
        const page = useGrid.getPage();
        const size = useGrid.getSize();
        const rowMetrics = this.#getRowMetrics();
        return data.map((data, index) => {
          const viewIndex =
            useGrid.getHeight() === undefined
              ? index
              : index + this.#getIndexStart();
          const dataIndex =
            !useGrid.getPagination() || useGrid.getPagination() === "external"
              ? viewIndex
              : viewIndex + page * size;
          const { top, height } = rowMetrics[viewIndex] || {};
          const key = `${this.key}:b:${dataIndex}`;
          return {
            key,
            data,
            top,
            height,
            viewIndex,
            dataIndex,
          };
        });
      };
    })()
  ).current;

  const contextValue = useMemo(() => {
    return { grid, useGrid };
  }, []);

  return (
    <GridContext.Provider value={contextValue}>{children}</GridContext.Provider>
  );
};

const GridComponent = memo(() => {
  console.log("Grid");
  const { useGrid, grid } = useInitialize("Grid");
  const height = useGrid.getHeight();
  const pagination = useGrid.getPagination();

  return (
    <div className="w-full">
      <div
        className="w-full overflow-auto text-[14px]"
        ref={grid.scrollerRefCallback}
        onScroll={grid.handleScroll}
        style={{ height }}
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
  const { useGrid, grid } = useInitialize("Header");
  const key = grid.key;
  const schema = useGrid.getSchema();
  const { radio, checkbox, header, headerWidths, headerRowCount } = schema;
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
      {header.map((col, colIndex) => {
        const { colCount, cells } = col;
        const colKey = `${key}:h:${colIndex}`;
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
              const celKey = `${colKey}:${cellIndex}`;
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
  const { grid, useGrid } = useInitialize("Body");
  const schema = useGrid.getSchema();
  const { height, body, headerWidths, bodyRowCount, edit } = schema;
  const hasGridHeight = !!height;
  const rows = grid.getRows();

  return (
    <div className="relative">
      {rows.map((row) => {
        const { key, data, dataIndex, viewIndex, top, height } = row;
        return (
          <Row
            key={key}
            rowKey={key}
            rowData={data}
            dataIndex={dataIndex}
            viewIndex={viewIndex}
            headerWidths={headerWidths}
            bodyRowCount={bodyRowCount}
            body={body}
            top={top}
            height={height}
            edit={edit}
            hasGridHeight={hasGridHeight}
            radioChecked={useGrid.isRadioData(dataIndex)}
            checkboxChecked={useGrid.isCheckboxData(dataIndex)}
          />
        );
      })}
    </div>
  );
});

const Row = memo(
  (props) => {
    const {
      rowKey,
      dataIndex,
      viewIndex,
      headerWidths,
      body,
      bodyRowCount,
      rowData,
      hasGridHeight,
      top,
      radioChecked,
    } = props;

    const { grid, useGrid } = useContext(GridContext);

    const $ = useRef(
      new (class {
        rowRef = null;
        observer = null;

        setObserver = () => {
          this.observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
              if (grid.setRowHeight(viewIndex, entry.contentRect.height)) {
                grid.readjust();
              }
            }
          });
        };

        observe = () => {
          this.observer.observe(this.rowRef);
        };

        disconnect = () => {
          this.observer.disconnect();
        };
      })()
    ).current;

    const schema = useGrid.getSchema();
    const radioData = useGrid.getRadioData();
    const checkboxData = useGrid.getCheckboxData();

    const { radio, checkbox } = schema;

    const handleRadio = () => {
      useGrid.setRadioData(dataIndex);
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
      if (hasGridHeight) {
        $.setObserver();
        $.observe();
      }

      return () => {
        if (hasGridHeight) {
          $.disconnect();
        }
      };
    }, [hasGridHeight]);

    return (
      <div
        ref={(ref) => {
          if (!ref) return;
          $.rowRef = ref;
        }}
        className={
          "grid border-l" +
          (hasGridHeight && top === undefined ? " opacity-0" : "") +
          (!hasGridHeight ? "" : " absolute")
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
              name={`${grid.key}:r`}
              type="radio"
              defaultChecked={radioChecked}
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
        {body.map((col, colIndex) => {
          const { colCount, cells } = col;
          const colKey = `${rowKey}:${colIndex}`;
          return (
            <div
              key={colKey}
              className="grid grid-cols-subgrid grid-rows-subgrid"
              style={{
                gridColumn: `span ${colCount}`,
                gridRow: `span ${bodyRowCount}`,
              }}
            >
              {cells.map((cell, cellIndex) => {
                const { id, colSpan, rowSpan, binding, ...rest } = cell;
                const celKey = `${colKey}:${cellIndex}`;

                const defaultValue = rowData[binding];
                // const renderer = $useGrid.renderer?.body?.[id]?.({
                //   data: cloneDeep(rowData),
                //   schema: cloneDeep(cell),
                //   index: dataIndex,
                //   setData,
                // });

                const onChange = (event) => {
                  let nextValue;
                  switch (rest.type) {
                    case "checkbox":
                      nextValue = Array.isArray(defaultValue)
                        ? defaultValue
                        : [];
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

                  // if (!$useGrid.updatedData.includes(rowData)) {
                  //   $useGrid.updatedData.push(rowData);
                  // }
                  // rowData[binding] = nextValue;

                  useGrid.setRowData(dataIndex, {
                    ...rowData,
                    [binding]: nextValue,
                  });
                  // renderRow();
                };

                return (
                  <div
                    key={celKey}
                    className="border-r border-b flex items-center p-1"
                    style={{
                      gridColumn: `span ${colSpan}`,
                      gridRow: `span ${rowSpan}`,
                    }}
                  >
                    {/* {renderer ?? ( */}
                    <Control
                      {...rest}
                      defaultValue={defaultValue}
                      onChange={onChange}
                    />
                    {/* // )} */}
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
    // return false;
    return (
      deepEqual(prevProps.rowData, nextProps.rowData) &&
      prevProps.hasGridHeight === nextProps.hasGridHeight &&
      prevProps.top === nextProps.top &&
      prevProps.height === nextProps.height
      // prevProps.radioChecked === nextProps.radioChecked
    );
  }
);

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

  const { useGrid } = useInitialize("Footer");
  const schema = useGrid.getSchema();
  const dataCount = useGrid.getDataCount();
  const { page, size } = schema;

  return (
    <div className="min-h-12 bg-gray-100 px-2 flex items-center gap-8">
      <Sizination size={size} onChange={useGrid.setSize} />
      <Pagination
        page={page}
        perPage={size}
        count={dataCount}
        onChange={useGrid.setPage}
      />
    </div>
  );
});

const Pagination = (props) => {
  const { page, count = 0, perPage = 10, chunk = 10, onChange } = props;
  const { grid } = useContext(GridContext);
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
        const key = `${grid.key}:p:${value}`;
        return (
          <button
            key={key}
            type="button"
            className={
              "text-sm border rounded w-8 h-8" +
              (page === value ? " font-semibold" : "")
            }
            onClick={() => onChange?.(value)}
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
  const { grid } = useContext(GridContext);
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
        const key = `${grid.key}:s:${value}`;
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
