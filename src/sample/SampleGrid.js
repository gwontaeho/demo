import { useLayoutEffect } from "react";
import { useGrid } from "../hooks/useGrid";
import { Grid } from "../components/Grid";

import utils from "../utils";

export const SampleGrid = () => {
  const { schema, getData, setData } = useGrid({
    defaultSchema: {
      edit: true,
      radio: true,
      checkbox: true,
      height: "500px",
      header: [
        {
          colCount: 2,
          rowCount: 3,
          cells: [
            { binding: "text", rowSpan: 2, colSpan: 2 },
            { binding: "text", width: "300px" },
            { binding: "text", width: "350px" },
          ],
        },
        {
          rowCount: 3,
          cells: [
            { binding: "number", width: "100px" },
            { binding: "number", rowSpan: 2, width: "100px" },
          ],
        },
        {
          rowCount: 3,
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
          cells: [{ binding: "b", type: "text" }],
        },
        {
          cells: [{ binding: "c", type: "textarea" }],
        },
      ],
    },
  });

  useLayoutEffect(() => {
    setData(utils.mock(1));
  }, []);

  console.log(schema);

  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={() => console.log(getData())}>get data</button>
        <button onClick={() => setData(utils.mock(10))}>set data</button>
      </div>

      <Grid {...schema} />
    </div>
  );
};
