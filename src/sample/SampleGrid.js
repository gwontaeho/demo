import { useEffect, useState, useRef, useReducer } from "react";
import { useGrid } from "../modules/grid";
import { Grid } from "../modules/grid";

import utils from "../.temp/utils";

export const SampleGrid = () => {
  console.log("Grid");
  const {
    ref,
    schema,
    setSchema,
    setHeader,
    getData,
    setData,
    setSize,
    setPage,
    setEdit,
    addRow,
    removeRow,
    getPage,
    getSize,
    setHeight,
    upRow,
    downRow,
    setSort,
    setGroup,
    getRadioData,
    getCheckboxData,
    setShow,
    setRadio,
    setCheckbox,
    renderGrid,
    renderBody,
    renderHeader,
    // setOnSizeChange,
    // setOnPageChange,
    // setRenderer,
  } = useGrid({
    defaultSchema: {
      // pagination: true,
      page: 0,
      size: 10,
      // edit: true,
      radio: true,
      checkbox: true,
      height: "500px",
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

  const tests = [
    {
      name: "test render",
      onClick: () => {
        setTest((prev) => ++prev);
      },
    },
    {
      name: "get data",
      onClick: () => {
        console.log(getData());
      },
    },
    {
      name: "set header",
      onClick: () => {
        setHeader((prev) => {
          prev[0].cells[0].binding = "qwe";
          return prev;
        });
      },
    },
    {
      name: "set edit : true",
      onClick: () => {
        setEdit(true);
      },
    },
    {
      name: "set edit : false",
      onClick: () => {
        setEdit(false);
      },
    },
    {
      name: "remove last",
      onClick: () => {
        removeRow(-1);
      },
    },
    {
      name: "add",
      onClick: () => {
        addRow();
      },
    },
    {
      name: "get page",
      onClick: () => {
        console.log(getPage());
      },
    },
    {
      name: "get size",
      onClick: () => {
        console.log(getSize());
      },
    },
    {
      name: "set height : 700px",
      onClick: () => {
        setHeight("700px");
      },
    },
    {
      name: "set height : undefined",
      onClick: () => {
        setHeight();
      },
    },
    {
      name: "up : 2",
      onClick: () => {
        upRow(2);
      },
    },
    {
      name: "down : 2",
      onClick: () => {
        downRow(2);
      },
    },
    {
      name: "sort : number",
      onClick: () => {
        sort("number");
      },
    },
    {
      name: "group : text",
      onClick: () => {
        setGroup("text");
      },
    },
    {
      name: "set page : 2",
      onClick: () => {
        setPage(2);
      },
    },
    {
      name: "set size : 20",
      onClick: () => {
        setSize(20);
      },
    },
    {
      name: "render grid",
      onClick: () => {
        renderGrid();
      },
    },
    {
      name: "render body",
      onClick: () => {
        renderBody();
      },
    },
    {
      name: "render header",
      onClick: () => {
        renderHeader();
      },
    },
  ];

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

  const aaa = useRef(
    new (class {
      abc = "4";

      setAbc() {
        this.abc = 7;
      }
    })()
  ).current;

  // console.log(schema);

  const [, forceUpdate] = useReducer(() => ({}));

  return (
    <div>
      <div onClick={forceUpdate}>force</div>
      <div
        onClick={() => {
          aaa.setAbc();
        }}
      >
        gogot
      </div>
      <div
        onClick={() => {
          console.log(aaa.abc);
        }}
      >
        gogo
      </div>
      <div className="grid grid-cols-10 gap-1 mb-10">
        {tests.map(({ name, onClick }) => {
          return (
            <button
              className="border"
              key={utils.uuid()}
              type="button"
              onClick={onClick}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div>
        <Grid ref={ref} {...schema} />
      </div>
    </div>
  );
};
