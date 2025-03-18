import { memo, useRef, useLayoutEffect } from "react";
import { useInit } from "../hooks/useInit";
import { useGridContext } from "../hooks/useGridContext";
import { Cell } from "./Cell";
import { Control } from "../../control";

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
  const { height, body, headerWidths, bodyRowCount, index, radio, checkbox } =
    getSchema();
  const rows = getRows();
  const keyBase = getKeyBase();
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

  console.log(body);

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
      {index && <Cell>{dataIndex}</Cell>}
      {radio && (
        <Cell>
          <input
            name={`${keyBase}:radio`}
            type="radio"
            defaultChecked={isRadioChecked}
            onChange={() => handleRadioChange(dataIndex)}
          />
        </Cell>
      )}
      {checkbox && (
        <Cell>
          <input
            type="checkbox"
            defaultChecked={isCheckboxChecked}
            onChange={() => handleCheckboxChange(dataIndex)}
          />
        </Cell>
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
              const { id, colSpan, rowSpan, field, ...rest } = cell;
              const celKey = `${colKey}:${cellIndex}`;

              const defaultValue = rowData[field];

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
                      handleRowChange(dataIndex, field, newValue)
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

export { Body };
