import { memo } from "react";
import { useInit } from "../hooks/useInit";
import { useGridContext } from "../hooks/useGridContext";
import { Cell } from "./Cell";

const Header = memo(() => {
  console.log("Grid Header");
  useInit("Header");
  const { getKeyBase, getSchema, getGridTemplate } = useGridContext();
  const { index, radio, checkbox, header, headerRowCount } = getSchema();
  const keyBase = getKeyBase();

  return (
    <div
      className="sticky top-0 min-w-fit grid border-t border-l bg-gray-100 z-[1]"
      style={getGridTemplate("header")}
    >
      {index && <Cell />}
      {radio && <Cell />}
      {checkbox && <Cell />}
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

export { Header };
