import { useEffect, useLayoutEffect } from "react";
import { useGrid } from "../hooks/useGrid";
import { Grid } from "../components/Grid";

import utils from "../utils";

export const SampleGrid = () => {
  const { schema, setHeader, getData, setData, setEdit, addRow, removeRow } =
    useGrid({
      defaultSchema: {
        page: 0,
        size: 10,
        edit: true,
        radio: true,
        checkbox: true,
        height: "500px",
        header: [
          {
            colCount: 2,
            rowCount: 3,
            cells: [
              { binding: "span 2", rowSpan: 2, colSpan: 2 },
              { binding: "text" },
              { binding: "textqwdqw" },
            ],
          },
          {
            cells: [
              { binding: "number", width: "100px" },
              { binding: "number", rowSpan: 2, width: "100px" },
            ],
          },
          {
            cells: [{ binding: "date", rowSpan: 3, width: "150px" }],
          },
        ],
        body: [
          {
            colCount: 2,
            cells: [
              { binding: "a", type: "text" },
              { binding: "a", type: "text" },
            ],
          },
          {
            cells: [{ binding: "b", type: "text", rowSpan: 2 }],
          },
          {
            cells: [{ binding: "c", type: "textarea" }],
          },
        ],
      },
    });

  useEffect(() => {
    // setData(utils.mock(10));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={() => console.log(getData())}>get data</button>
        <button onClick={() => setData(utils.mock(10))}>set data</button>
        <button
          onClick={() =>
            setHeader((prev) => {
              prev[0].cells[0].binding = "qwe";
              return prev;
            })
          }
        >
          set header
        </button>
        <button onClick={() => setEdit(true)}>set edit true</button>
        <button onClick={() => setEdit(false)}>set edit false</button>
        <button onClick={() => removeRow(-1)}>remove row</button>
        <button onClick={() => addRow()}>add row</button>
      </div>

      <Grid {...schema} />
    </div>
  );
};
