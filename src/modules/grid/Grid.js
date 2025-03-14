import { useRef, useLayoutEffect, useState, memo, forwardRef } from "react";
import { GridContextProvider, useGridContext, useInit } from "./GridContext";
import { Control } from "../control";

const GridComponent = memo(() => {
  console.log("Grid");
  useInit("Grid");
  const { scrollerRefCallback, handleScroll, getSchema, getHeight } =
    useGridContext();
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
  useInit("Header");
  const { getKeyBase, getSchema, getGridTemplate } = useGridContext();
  const keyBase = getKeyBase();
  const { index, radio, checkbox, header, headerRowCount } = getSchema();

  return (
    <div
      className="sticky top-0 min-w-fit grid border-t border-l bg-gray-100 z-[1]"
      style={getGridTemplate("header")}
    >
      {index && <OptionCell />}
      {radio && <OptionCell />}
      {checkbox && <OptionCell />}
      {header.map((column, columnIndex) => {
        const { colCount, cells } = column;
        const colKey = `${keyBase}:header:${columnIndex}`;
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
  useInit("Body");
  const {
    getSchema,
    getRows,
    getGridTemplate,
    createObserver,
    getKeyBase,
    handleRowChange,
    handleRadioChange,
    handleCheckboxChange,
    isRadioData,
    isCheckboxData,
  } = useGridContext();
  const keyBase = getKeyBase();
  const { height, body, headerWidths, bodyRowCount, index, radio, checkbox } =
    getSchema();
  const rows = getRows();
  const gridHeight = !!height;

  return (
    <div className="relative">
      {rows.map((row) => {
        const { key, data, dataIndex, viewIndex, top, height } = row;
        return (
          <Row
            key={key}
            rowKey={key}
            keyBase={keyBase}
            rowData={data}
            dataIndex={dataIndex}
            viewIndex={viewIndex}
            headerWidths={headerWidths}
            bodyRowCount={bodyRowCount}
            body={body}
            top={top}
            height={height}
            gridHeight={gridHeight}
            index={index}
            radio={radio}
            checkbox={checkbox}
            handleRowChange={handleRowChange}
            createObserver={createObserver}
            handleRadioChange={handleRadioChange}
            handleCheckboxChange={handleCheckboxChange}
            isRadioChecked={isRadioData(dataIndex)}
            isCheckboxChecked={isCheckboxData(dataIndex)}
            className={
              "grid border-l" +
              (gridHeight && top === undefined ? " opacity-0" : "") +
              (!gridHeight ? "" : " absolute")
            }
            style={{ ...getGridTemplate("body"), top }}
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
    body,
    bodyRowCount,
    rowData,
    gridHeight,

    index,
    radio,
    checkbox,
    keyBase,
    createObserver,
    handleRowChange,
    handleRadioChange,
    handleCheckboxChange,
    isRadioChecked,
    isCheckboxChecked,
    style,
    className,
  } = props;

  const rowRef = useRef(null);

  useLayoutEffect(() => {
    if (gridHeight) {
      const observer = createObserver(viewIndex);
      observer.observe(rowRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [gridHeight]);

  return (
    <div ref={rowRef} className={className} style={style}>
      {index && <OptionCell>{dataIndex}</OptionCell>}
      {radio && (
        <OptionCell>
          <input
            name={`${keyBase}:radio`}
            type="radio"
            defaultChecked={isRadioChecked}
            onChange={() => handleRadioChange(dataIndex)}
          />
        </OptionCell>
      )}
      {checkbox && (
        <OptionCell>
          <input
            type="checkbox"
            defaultChecked={isCheckboxChecked}
            onChange={() => handleCheckboxChange(dataIndex)}
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

              return (
                <div
                  key={celKey}
                  className="border-r border-b flex items-center px-1 [&>div]:w-full"
                  style={{
                    gridColumn: `span ${colSpan}`,
                    gridRow: `span ${rowSpan}`,
                  }}
                >
                  <Control
                    {...rest}
                    defaultValue={defaultValue}
                    onChange={(newValue) =>
                      handleRowChange(dataIndex, binding, newValue)
                    }
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

const Footer = memo(() => {
  console.log("Grid Footer");
  useInit("Footer");
  const { getRef, getSchema, handleSizeChange, handlePageChange } =
    useGridContext();
  const { page, size } = getSchema();
  const { dataCount } = getRef();

  return (
    <div className="min-h-10 bg-gray-100 px-2 flex items-center gap-8">
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

  return (
    <div className="flex gap-1">
      <button
        type="button"
        className="text-sm border rounded w-6 h-6"
        onClick={handlePrevClick}
      >{`<`}</button>
      {list?.map((value) => {
        const key = `${keyBase}:p:${value}`;
        return (
          <button
            key={key}
            type="button"
            className={
              "text-sm border rounded w-6 h-6" +
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
        className="text-sm border rounded w-6 h-6"
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
      className="h-6 w-20 rounded border text-sm"
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
