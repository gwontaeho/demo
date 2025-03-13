import {
  useRef,
  useLayoutEffect,
  useState,
  memo,
  forwardRef,
  useEffect,
} from "react";
import { GridContextProvider, useGridContext, useInit } from "./GridContext";

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

const GridComponent = memo(() => {
  console.log("Grid");
  const { scrollerRefCallback, handleScroll, getSchema, getHeight } =
    useInit("Grid");
  const { pagination } = getSchema();
  const height = getHeight();

  return (
    <div className="w-full">
      <div
        className="w-full overflow-auto text-[14px]"
        ref={scrollerRefCallback}
        onScroll={handleScroll}
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
  const { getKeyBase, getSchema, getGridTemplate } = useInit("Header");
  const keyBase = getKeyBase();
  const { radio, checkbox, header, headerRowCount } = getSchema();

  return (
    <div
      className="sticky top-0 min-w-fit grid border-t border-l bg-gray-100 z-[1]"
      style={getGridTemplate()}
    >
      {radio && <OptionCell />}
      {checkbox && <OptionCell />}
      {header.map((col, colIndex) => {
        const { colCount, cells } = col;
        const colKey = `${keyBase}:header:${colIndex}`;
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
  const { getSchema, getRows, getGridTemplate, createObserver } =
    useInit("Body");
  const { height, body, headerWidths, bodyRowCount, radio, checkbox } =
    getSchema();
  const rows = getRows();
  const hasGridHeight = !!height;

  console.log(rows);

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
            hasGridHeight={hasGridHeight}
            radio={radio}
            checkbox={checkbox}
            createObserver={createObserver}
            className={
              "grid border-l" +
              (hasGridHeight && top === undefined ? " opacity-0" : "") +
              (!hasGridHeight ? "" : " absolute")
            }
            style={{ ...getGridTemplate(), top }}
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
    top,
    body,
    bodyRowCount,
    rowData,
    hasGridHeight,
    radio,
    checkbox,

    createObserver,

    style,
    className,
  } = props;

  const rowRef = useRef(null);

  useLayoutEffect(() => {
    if (hasGridHeight) {
      const observer = createObserver(viewIndex);
      observer.observe(rowRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [hasGridHeight]);

  return (
    <div ref={rowRef} className={className} style={style}>
      {radio && (
        <OptionCell>
          {/* <input
              name={`${keyBase}:radio`}
              type="radio"
              defaultChecked={radioChecked}
              // onChange={handleRadio}
            /> */}
          {dataIndex}
        </OptionCell>
      )}
      {checkbox && (
        <OptionCell>
          <input
            type="checkbox"
            // defaultChecked={checkboxData.includes(rowData)}
            // onChange={handleCheckbox}
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

                // if (!$useGrid.updatedData.includes(rowData)) {
                //   $useGrid.updatedData.push(rowData);
                // }
                // rowData[binding] = nextValue;

                // useGrid.setRowData(dataIndex, {
                //   ...rowData,
                //   [binding]: nextValue,
                // });
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
                  <Control
                    {...rest}
                    defaultValue={defaultValue}
                    onChange={onChange}
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
  const { type, editable, ...rest } = props;

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

  if (editable === false) {
    return <div className="max-w-full break-words">{controlText}</div>;
  }

  return (
    <div className="w-full [&>*]:w-full">
      {/* {type === "text" ? (
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
      ) : null} */}
    </div>
  );
};

const Footer = memo(() => {
  console.log("Grid Footer");

  const { getRef, getSchema, onSizeChange, onPageChange } = useInit("Footer");
  const { page, size } = getSchema();
  const { dataCount } = getRef();

  return (
    <div className="min-h-12 bg-gray-100 px-2 flex items-center gap-8">
      <Sizination size={size} onChange={onSizeChange} />
      <Pagination
        page={page}
        perPage={size}
        count={dataCount}
        onChange={onPageChange}
      />
    </div>
  );
});

const Pagination = (props) => {
  const { page, count = 0, perPage = 10, chunk = 10, onChange } = props;
  const { getKeyBase } = useGridContext();
  const keyBase = getKeyBase();
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
        const key = `${keyBase}:p:${value}`;
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
  const { getKeyBase } = useGridContext();
  const keyBase = getKeyBase();
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
        const key = `${keyBase}:s:${value}`;
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

export const Grid = forwardRef((props, ref) => {
  return (
    <GridContextProvider ref={ref} {...props}>
      <GridComponent />
    </GridContextProvider>
  );
});
