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
      cells: [
        { binding: "b1" },
        { binding: "b2" },
        { binding: "b3", rowSpan: 2 },
      ],
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

  let totalColumnCount = 0;
  const hs = schema.head.map((props) => {
    props.columnCount ||= 1;
    props.cells = props.cells.map((cellProps) => {
      cellProps.columnSpan ||= 1;
      cellProps.rowSpan ||= 1;
      return cellProps;
    });
    totalColumnCount += props.columnCount;
    return props;
  });

  const gridTemplateColumns = new Array(totalColumnCount)
    .fill("200px")
    .join(" ");

  return (
    <div>
      <div className="border border-green-500">
        <div className="grid" style={{ gridTemplateColumns }}>
          {hs.map((props, index) => {
            const { columnCount, cells } = props;

            return cells.map((cellProps, cellIndex) => {
              const { binding, columnSpan, rowSpan } = cellProps;

              console.log(index, columnSpan);

              return (
                <div
                  key={id + index + cellIndex}
                  className="min-h-10 border"
                  style={{
                    gridColumn: `${index + 1} / span ${columnSpan}`,
                    // gridRow: `span ${rowSpan}`,
                  }}
                >
                  {binding}
                </div>
              );
            });
          })}
        </div>
        {/* {data.map((props) => {
          return <div className="h-10 border">{props.a}</div>;
        })} */}
      </div>
    </div>
  );
};
