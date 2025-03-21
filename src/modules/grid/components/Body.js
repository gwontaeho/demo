import { memo, useRef, useLayoutEffect, useReducer } from "react";
import { useInit } from "../hooks/useInit";
import { useGridContext } from "../hooks/useGridContext";
import { Cell } from "./Cell";
import { Control } from "../../control";
import { uuid } from "../utils/utils";

const Body = memo(() => {
  console.log("Grid Body");
  useInit("Body");
  const {
    getRef,
    getSchema,
    getRows,
    getGridTemplate,
    createObserver,
    getKeyBase,
    handleRowChange,
    handleRadioChange,
    handleCheckboxChange,
  } = useGridContext();
  const {
    height,
    body,
    headerWidths,
    bodyRowCount,
    index,
    radio,
    checkbox,
    editable,
  } = getSchema();
  const { rows, viewIndexOffset, dataIndexOffset, rowMetrics } = getRows();
  const { data, radioData, checkboxData, addedData, removedData } = getRef();

  const keyBase = getKeyBase();
  const hasHeight = !!height;
  const hasIndex = index;
  const hasRadio = radio;
  const hasCheckbox = checkbox;

  return (
    <div className="relative">
      {rows.map((_, rowIndex) => {
        const viewIndex = rowIndex + viewIndexOffset;
        const dataIndex = viewIndex + dataIndexOffset;
        const { top, height } = rowMetrics[viewIndex] ?? {};

        const rowObject = data[dataIndex];

        const isAdded = addedData.includes(rowObject);
        const isRemoved = removedData.includes(rowObject);
        const isRadioChecked = rowObject === radioData;
        const isCheckboxChecked = checkboxData.includes(rowObject);

        const className =
          "grid border-l" +
          (hasHeight && top === undefined ? " opacity-0" : "") +
          (!hasHeight ? "" : " absolute");
        const style = { ...getGridTemplate("body"), top };

        const key = `${keyBase}:${viewIndex}:${dataIndex}:${editable}`;

        return (
          <Row
            key={key}
            data={data}
            body={body}
            style={style}
            keyBase={keyBase}
            hasHeight={hasHeight}
            className={className}
            dataIndex={dataIndex}
            viewIndex={viewIndex}
            headerWidths={headerWidths}
            bodyRowCount={bodyRowCount}
            createObserver={createObserver}
            handleRowChange={handleRowChange}
            handleRadioChange={handleRadioChange}
            handleCheckboxChange={handleCheckboxChange}
            hasIndex={hasIndex}
            hasRadio={hasRadio}
            hasCheckbox={hasCheckbox}
            isAdded={isAdded}
            isRemoved={isRemoved}
            isRadioChecked={isRadioChecked}
            isCheckboxChecked={isCheckboxChecked}
          />
        );
      })}
    </div>
  );
});

const Row = (props) => {
  const {
    style,
    className,
    dataIndex,
    viewIndex,
    body,
    bodyRowCount,
    data,
    hasHeight,
    hasIndex,
    hasRadio,
    hasCheckbox,
    keyBase,
    createObserver,
    handleRowChange,
    handleRadioChange,
    handleCheckboxChange,
    isRadioChecked,
    isCheckboxChecked,
  } = props;

  const forceUpdate = useReducer(() => ({}))[1];
  const row = data[dataIndex];
  const rowRef = useRef(null);

  useLayoutEffect(() => {
    if (hasHeight) {
      const observer = createObserver(viewIndex);
      observer.observe(rowRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [hasHeight]);

  return (
    <div ref={rowRef} className={className} style={style}>
      {hasIndex && <Cell>{dataIndex}</Cell>}
      {hasRadio && (
        <Cell>
          <input
            name={`${keyBase}:radio`}
            type="radio"
            defaultChecked={isRadioChecked}
            onChange={() => handleRadioChange(dataIndex)}
          />
        </Cell>
      )}
      {hasCheckbox && (
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
        const colKey = `${keyBase}:${colIndex}`;
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

              const value = row?.[field] || "";

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
                    value={value}
                    onChange={(newValue) => {
                      handleRowChange(dataIndex, field, newValue);
                      forceUpdate();
                    }}
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
