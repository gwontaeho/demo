import { useId } from "react";

const data = Array(6).fill({ a: "a", b: "b", c: "c" });

/**
 * 스키마로 헤더 행 정의
 * 스키마로 행 정의
 */
const schema = {
  head: [
    {
      id: "a",
      columnCount: 2,
      cells: [
        { binding: "a" },
        { binding: "a" },
        { binding: "a" },
        {
          binding: "a",
        },
        { binding: "a" },
        { binding: "a", columnSpan: 2 },
      ],
    },
    {
      id: "b",
      rowCount: 4,
      cells: [{ binding: "b" }, { binding: "b" }, { binding: "b", rowSpan: 2 }],
    },
    { id: "c", cells: [{ binding: "c" }] },
  ],
  body: [
    { cells: [{ binding: "a" }] },
    { cells: [{ binding: "b" }] },
    { cells: [{ binding: "c" }] },
  ],
};

export const Grid = () => {
  const id = useId();

  const hs = schema.head.map((props) => {
    props.columnCount ||= 1;
    props.cells = props.cells.map((cellProps) => {
      cellProps.columnSpan ||= 1;
      cellProps.rowSpan ||= 1;
      return cellProps;
    });
    return props;
  });

  return (
    <div>
      <div className="border border-green-500">
        <div className="flex">
          {hs.map((props, index) => {
            const { columnCount, rowCount, cells } = props;
            const gridTemplateColumns = new Array(columnCount)
              .fill("200px")
              .join(" ");
            const gridTemplateRows = `repeat(${rowCount}, 1fr)`;
            return (
              <div
                key={id + index}
                className="grid"
                style={{
                  gridTemplateColumns,
                  gridTemplateRows,
                }}
              >
                {cells.map((cellProps, cellIndex) => {
                  const { binding, columnSpan, rowSpan } = cellProps;
                  return (
                    <div
                      key={id + index + cellIndex}
                      className="min-h-10 border"
                      style={{
                        gridColumn: `span ${columnSpan}`,
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
        {/* {data.map((props) => {
          return <div className="h-10 border">{props.a}</div>;
        })} */}
      </div>
    </div>
  );
};
