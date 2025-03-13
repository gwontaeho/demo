import { useEffect, useState, useRef, useReducer } from "react";
import { useGrid } from "../modules/grid";
import { Grid } from "../modules/grid";

import utils from "../.temp/utils";

export const SampleGrid = () => {
  const { ref, schema, setEditable, setData } = useGrid({
    defaultSchema: {
      pagination: true,
      page: 0,
      size: 10,
      // edit: true,
      radio: true,
      checkbox: true,
      height: 700,
      header: [
        { id: "test12", cells: [{ binding: "text" }] },
        { cells: [{ binding: "number", width: "100px" }] },
        // { cells: [{ binding: "date", width: "150px" }] },
      ],
      body: [
        { cells: [{ id: "custom-cell" }] },
        {
          cells: [
            {
              binding: "text",
              type: "textarea",

              // decimalScale: 2,
              // thousandsSeparator: true,
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

  return (
    <div>
      <div onClick={forceUpdate}>force</div>

      <div className="grid grid-cols-8 gap-2">
        <button onClick={() => setEditable(true)}>set editable true</button>
        <button onClick={() => setEditable(false)}>set editable false</button>
      </div>

      <div>
        <Grid ref={ref} {...schema} />
      </div>
    </div>
  );
};
