import { useEffect, useState, useRef, useReducer } from "react";
import { useGrid } from "../module/grid";
import { Grid } from "../module/grid";

import utils from "../.temp/utils";
import { cloneDeep } from "../module/grid/utils/utils";

export const SampleGrid = () => {
  const {
    ref,
    setEditable,
    setData,
    getData,
    upRow,
    downRow,
    addRow,
    removeRow,
    getRemoveData,
    getAddedData,
    updateRow,
  } = useGrid({
    defaultSchema: {
      pagination: true,
      editable: true,
      index: true,
      radio: true,
      checkbox: true,
      height: 500,
      // header: [
      //   { cells: [{ field: "index" }] },
      //   { cells: [{ field: "text" }] },
      //   { cells: [{ field: "number" }] },
      //   { cells: [{ field: "radio" }] },
      //   { cells: [{ field: "checkbox" }] },
      // ],
      body: [
        { cells: [{ field: "index", type: "text" }] },
        { cells: [{ field: "text", type: "text" }] },
        { cells: [{ field: "number", type: "number" }] },
        {
          cells: [
            {
              field: "radio",
              type: "radio",
              options: [
                { label: "a", value: "a" },
                { label: "b", value: "b" },
                { label: "c", value: "c" },
              ],
            },
          ],
        },
        {
          cells: [
            {
              field: "checkbox",
              type: "checkbox",
              options: [
                { label: "a", value: "a" },
                { label: "b", value: "b" },
                { label: "c", value: "c" },
              ],
            },
          ],
        },
      ],
    },
  });

  // console.log(schema);

  const [test, setTest] = useState(0);

  useEffect(() => {
    setData(utils.mock(999));
  }, []);

  const fetchData = (value) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(utils.mock(value === 3 ? 3 : 10));
      }, 1000);
    });

  const handleChangePage = async (value) => {
    const d = await fetchData(value);
    setData(d, 40);
  };
  const handleChangeSize = (value) => {
    console.log(value);
  };

  const [, forceUpdate] = useReducer(() => ({}));

  useEffect(() => {
    // console.time("c");
    // cloneData(utils.mock(999999));
    // console.timeEnd("c");
    // console.time("a");
    // utils.mock(999999).map((item) => {
    //   item.key = utils.uuid();
    //   return item;
    // });
    // console.timeEnd("a");
    // console.time("b");
    // utils.cloneDeep(utils.mock(999999));
    // console.timeEnd("b");
    // console.time("c");
    // const aa = utils.mock(999999).map((item) => {
    //   return { o: cloneDeep(item), d: cloneDeep(item) };
    // });
    // console.timeEnd("c");
    // console.time("cc");
    // console.log(
    //   aa.map((item) => {
    //     return cloneDeep(item.d);
    //   })
    // );
    // console.timeEnd("cc");
    // console.time("d");
    // utils.mock(999999).map((item) => {
    //   item.key = Symbol();
    //   return item;
    // });
    // console.timeEnd("d");
    // const a = utils.mock(1).map((item) => {
    //   item.key = Symbol();
    //   return item;
    // });
    // const b = a[0];
    // console.log(a[0].key === b.key);
    // console.time("b");
    // utils.mock(999999).map((item) => {
    //   delete item.key;
    //   return item;
    // });
    // console.timeEnd("b");
  }, []);

  return (
    <div>
      <div onClick={forceUpdate}>force</div>

      <div className="grid grid-cols-8 gap-2">
        <button onClick={() => setEditable(true)}>set editable true</button>
        <button onClick={() => setEditable(false)}>set editable false</button>
        <button onClick={() => console.log(getData())}>get Data</button>
        <button onClick={() => upRow(2)}>up 2</button>
        <button onClick={() => downRow(4)}>down 4</button>
        <button onClick={() => addRow()}>add</button>
        <button onClick={() => removeRow(0)}>remove</button>
        <button onClick={() => console.log(getAddedData())}>get added</button>
        <button onClick={() => console.log(getRemoveData())}>
          get removed
        </button>
        <button onClick={() => updateRow(2, "text", "qwdqwd")}>
          update Row
        </button>
      </div>

      <div>
        <Grid ref={ref} />
      </div>
    </div>
  );
};
