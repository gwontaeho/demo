import { useEffect, useState, useRef, useReducer } from "react";
import { useGrid } from "../modules/grid";
import { Grid } from "../modules/grid";

import utils from "../.temp/utils";

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
  } = useGrid({
    defaultSchema: {
      pagination: true,
      editable: true,
      index: true,
      radio: true,
      checkbox: true,
      height: 500,
      header: [
        { cells: [{ binding: "index" }] },
        { cells: [{ binding: "text" }] },
        { cells: [{ binding: "number" }] },
        { cells: [{ binding: "radio" }] },
        { cells: [{ binding: "checkbox" }] },
      ],
      body: [
        { cells: [{ binding: "index", type: "text" }] },
        { cells: [{ binding: "text", type: "text" }] },
        { cells: [{ binding: "number", type: "number" }] },
        {
          cells: [
            {
              binding: "radio",
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
              binding: "checkbox",
              type: "checkbox",
              options: [
                { label: "a", value: "a" },
                { label: "b", value: "b" },
                { label: "c", value: "c" },
              ],
            },
          ],
        },
        // {
        //   cells: [
        //     {
        //       binding: "checkbox",
        //       type: "checkbox",
        //       options: [
        //         { value: 1, label: "1" },
        //         { value: 2, label: "2" },
        //         { value: 3, label: "3" },
        //         { value: 4, label: "4" },
        //         { value: 5, label: "5" },
        //       ],
        //     },
        //   ],
        // },
      ],
    },
  });

  // console.log(schema);

  const [test, setTest] = useState(0);

  useEffect(() => {
    setData(utils.mock(5));
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

  // setOnSizeChange((value) => {
  //   console.log(getPage());
  //   console.log(test);
  //   console.log(value, "asd");
  // });

  // setOnPageChange((value) => {
  //   // console.log(test);
  //   console.log(value, "asd");

  //   // const d = await fetchData(value);
  //   setData(utils.mock(1));
  // });

  // setRenderer({
  //   body: {
  //     "custom-cell": (params) => {
  //       const { data, setData } = params;

  //       return (
  //         <div>
  //           {/* {data.number} */}
  //           <button
  //             onClick={() =>
  //               setData((prev) => {
  //                 prev.text = "asd";
  //                 return { number: 1, text: "a" };
  //               })
  //             }
  //           >
  //             {test}
  //           </button>
  //         </div>
  //       );
  //     },
  //   },
  // });

  const [, forceUpdate] = useReducer(() => ({}));

  useEffect(() => {
    // console.time("a");
    // utils.mock(999999).map((item) => {
    //   item.key = utils.uuid();
    //   return item;
    // });
    // console.timeEnd("a");
    // console.time("c");
    // utils.mock(999999).map((item) => {
    //   item.key = crypto.randomUUID();
    //   return item;
    // });
    // console.timeEnd("c");
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
      </div>

      <div>
        <Grid ref={ref} />
      </div>
    </div>
  );
};
