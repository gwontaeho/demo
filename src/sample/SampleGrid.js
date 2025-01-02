export const SampleGrid = () => {
  const { grid, getData, setData } = useGrid({
    defaultSchema: {
      edit: true,
      radio: true,
      checkbox: true,
      height: "500px",
      header: [
        {
          colCount: 2,
          rowCount: 3,
          colWidths: ["150px", "250px"],
          cells: [
            { binding: "text", rowSpan: 2, colSpan: 2 },
            { binding: "text" },
            { binding: "text" },
          ],
        },
        {
          rowCount: 3,
          cells: [{ binding: "number", rowSpan: 3 }],
        },
        {
          rowCount: 3,
          cells: [{ binding: "date", rowSpan: 3 }],
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
    setData(data());
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4">
        <button onClick={() => console.log(getData())}>get data</button>
        <button onClick={() => setData(data(30))}>set data</button>
      </div>

      <Grid {...grid} />
    </div>
  );
};
