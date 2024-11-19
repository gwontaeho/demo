import {
  useCallback,
  useEffect,
  memo,
  useId,
  useRef,
  useState,
  createContext,
  useContext,
  useLayoutEffect,
} from "react";

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

function throttle(func, delay) {
  let timer;
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, arguments);
        timer = undefined;
      }, delay);
    }
  };
}

/**
 * 스키마로 헤더 행 정의
 * 스키마로 행 정의
 */
const schema = {
  head: [
    {
      id: "a",
      columnCount: 2,
      rowCount: 4,
      columnWidths: ["200px", "300px"],
      cells: [
        { binding: "text", rowSpan: 2, colSpan: 2 },
        { binding: "text" },
        { binding: "text" },
      ],
    },
    {
      cells: [
        { binding: "number" },
        { binding: "number" },
        { binding: "number" },
      ],
    },
    { cells: [{ binding: "date" }] },
    // {
    //   id: "a",
    //   columnCount: 2,
    //   rowCount: 4,
    //   columnWidths: ["200px", "300px"],
    //   cells: [
    //     { binding: "a1" },
    //     { binding: "a2", rowSpan: 2 },
    //     { binding: "a3" },
    //     { binding: "a4" },
    //     { binding: "a5" },
    //     { binding: "a6", columnSpan: 2 },
    //   ],
    // },
    // {
    //   id: "b",
    //   rowCount: 4,
    //   cells: [
    //     { binding: "bbbb" },
    //     { binding: "b" },
    //     { binding: "b", rowSpan: 2 },
    //   ],
    // },
    // { id: "c", rowCount: 4, cells: [{ binding: "c", rowSpan: 4 }] },
    // { id: "c", rowCount: 4, cells: [{ binding: "c", rowSpan: 4 }] },
    // { id: "single1", columnWidths: ["700px"], cells: [{ binding: "a" }] },
    // { id: "single2", cells: [{ binding: "b" }] },
    // { id: "single3", cells: [{ binding: "c" }] },
  ],
  body: [
    {
      rowCount: 2,
      cells: [
        { binding: "a", columnSpan: 2 },
        { binding: "a" },
        { binding: "a" },
      ],
    },
    // { rowCount: 2, cells: [{ binding: "b" }, { binding: "b" }] },
    // { rowCount: 2, cells: [{ binding: "c", rowSpan: 2 }] },
    // { rowCount: 2, cells: [{ binding: "c", rowSpan: 2 }] },

    // { cells: [{ binding: "a" }] },
    // { cells: [{ binding: "b" }] },
    // { cells: [{ binding: "c" }] },
  ],
};

const GridContext = createContext({});
const useGridContext = () => useContext(GridContext);
const GridContextProvider = ({ children, data }) => {
  const _ = useRef({});
  if (Object.keys(_.current).length === 0) {
    _.current.initalRender = true;
    _.current.topIndex = 0;
    _.current.startIndex = 0;
    _.current.endIndex = 30;
    _.current.overscanCount = 20;
    _.current.totalDataCount = data.length;
    _.current.height = 600;
    _.current.page = 0;
    _.current.size = 10;
    _.current.pagination = false;
    _.current.rowStyles = [];
    for (let i = 0; i < data.length; i++)
      _.current.rowStyles[i] = { height: 40 };

    /* */
    _.current.checkedRows = null;
    _.current.selectedRow = null;
    _.current.selectedCell = null;
  }

  const [, setRenderingCount] = useState(0);

  const render = debounce(() => {
    setRenderingCount((prev) => (prev += 1));
  }, 100);

  const handleScroll = throttle(({ target }) => {
    try {
      _.current.topIndex = _.current.rowStyles.findIndex(
        ({ top, height }) => target.scrollTop < top + height
      );
      const { topIndex, overscanCount, rowStyles, headRef, totalDataCount } =
        _.current;
      _.current.topIndex = topIndex;
      _.current.startIndex = Math.max(topIndex - overscanCount, 0);
      _.current.endIndex = Math.min(
        topIndex +
          overscanCount +
          Math.ceil(
            (target.getBoundingClientRect().height -
              headRef.getBoundingClientRect().height) /
              rowStyles[topIndex].height
          ),
        totalDataCount
      );
      setRenderingCount((prev) => (prev += 1));
    } catch (error) {
      console.log(error);
    }
  }, 200);

  let headColumnCount = 0;
  let headColumnWidths = [];
  const headSchema = schema.head.map((props) => {
    props.columnCount ||= 1;
    props.rowCount ||= 1;
    props.columnWidths ||= Array(props.columnCount).fill("200px");
    props.cells = props.cells.map((cellProps) => {
      cellProps.columnSpan ||= 1;
      cellProps.rowSpan ||= 1;
      return cellProps;
    });
    headColumnCount += props.columnCount;
    headColumnWidths.push(...props.columnWidths);
    return props;
  });
  const bodySchema = schema.body.map((props, index) => {
    props.columnCount ||= headSchema[index].columnCount ||= 1;
    props.rowCount ||= 1;
    props.cells = props.cells.map((cellProps) => {
      cellProps.columnSpan ||= 1;
      cellProps.rowSpan ||= 1;
      return cellProps;
    });
    return props;
  });

  const handleChangeSize = (event) => {
    _.current.size = event.target.value;
    _.current.page = 0;
    render();
  };

  const handleChangePage = (page) => {
    _.current.page = page;
    render();
  };

  const value = {
    _,
    data,
    headSchema,
    bodySchema,
    headColumnWidths,
    handleScroll,
    handleChangeSize,
    handleChangePage,
    render,
  };

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};

export const Grid = memo((props) => {
  return (
    <GridContextProvider {...props}>
      <GridComponent />
    </GridContextProvider>
  );
});

const GridHead = () => {
  const id = useId();
  const { _, headSchema, headColumnWidths } = useGridContext();

  return (
    <div
      className="flex bg-slate-100 z-[1] border-l border-t sticky top-0 left-0 w-max"
      ref={(ref) => {
        _.current.headRef = ref;
      }}
    >
      <div className="w-10 border-r border-b items-center justify-center flex"></div>
      <div className="w-10 border-r border-b items-center justify-center flex"></div>
      <div className="w-10 border-r border-b items-center justify-center flex">
        <input type="checkbox" />
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: headColumnWidths.join(" "),
        }}
      >
        {headSchema.map((props, index) => {
          const { columnCount, rowCount, cells } = props;
          return (
            <div
              key={id + index}
              className="grid"
              style={{
                gridColumn: `span ${columnCount}`,
                gridRow: `span ${rowCount}`,
                gridTemplateColumns: "subgrid",
                gridTemplateRows: "subgrid",
              }}
            >
              {cells.map((cellProps, cellIndex) => {
                const { binding, columnSpan, rowSpan } = cellProps;
                return (
                  <div
                    key={id + index + cellIndex}
                    className="min-h-10 border-r border-b break-all flex items-center justify-center"
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
    </div>
  );
};

const GridBody = () => {
  const id = useId();
  const { _, data } = useGridContext();
  const {
    initalRender,
    startIndex,
    endIndex,
    rowStyles,
    totalDataCount,
    pagination,
    page,
    size,
  } = _.current;

  const view = data
    // .slice(page * size, page * size + size)
    .slice(startIndex, endIndex);

  const height = rowStyles.reduce((prev, curr) => {
    curr.top = prev;
    return prev + curr.height;
  }, 0);

  return (
    <div
      style={{
        visibility: initalRender ? "hidden" : undefined,
        position: "relative",
        // height,
      }}
    >
      {view.map((item, index) => {
        const dataIndex = Math.min(
          page * size + startIndex + index,
          totalDataCount
        );
        const viewIndex = pagination ? startIndex + index : dataIndex;
        return (
          <Row
            key={id + viewIndex}
            item={item}
            dataIndex={dataIndex}
            viewIndex={viewIndex}
          />
        );
      })}
    </div>
  );
};

const GridPagination = () => {
  const id = useId();
  const { _, handleChangeSize, handleChangePage } = useGridContext();
  const { size, page, totalDataCount } = _.current;
  const pageCount = Math.ceil(totalDataCount / size);

  return (
    <div className="h-10 bg-slate-100 flex justify-between items-center px-4">
      <div>
        <select defaultValue={size} onChange={handleChangeSize}>
          <option>10</option>
          <option>20</option>
          <option>30</option>
          <option>40</option>
          <option>50</option>
        </select>
      </div>
      <div className="[&_button]:min-w-10 [&_button]:p-2 [&_button]:border">
        <button>{`<`}</button>
        {Array(pageCount)
          .fill(null)
          .map((_, index) => {
            return (
              <button key={id + index} onClick={() => handleChangePage(index)}>
                {index + 1}
              </button>
            );
          })}
        <button>{`>`}</button>
      </div>
    </div>
  );
};

const GridComponent = () => {
  const { _, handleScroll } = useGridContext();
  const { height, pagination } = _.current;

  return (
    <div>
      <div
        onScroll={handleScroll}
        style={{
          overflow: "auto",
          height,
        }}
      >
        <GridHead />
        <GridBody />
      </div>
      {Boolean(pagination) && <GridPagination />}
    </div>
  );
};

const Row = (props) => {
  const { item, viewIndex, dataIndex } = props;

  const id = useId();
  const rowRef = useRef();
  const { _, bodySchema, headColumnWidths, render } = useGridContext();

  useLayoutEffect(() => {
    let initialCall = true;
    const resizeObserver = new ResizeObserver((entries) => {
      if (initialCall) {
        initialCall = false;
      } else {
        for (const entry of entries) {
          try {
            const prevHeight = _.current.rowStyles[viewIndex].height;
            const currHeight = entry.contentRect.height;
            if (prevHeight !== currHeight) {
              const style = { height: currHeight };
              _.current.rowStyles[viewIndex] = style;
            }
            render();
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
    resizeObserver.observe(rowRef.current);
    return () => {
      resizeObserver.unobserve(rowRef.current);
    };
  }, []);

  const rowRefCallback = useCallback((ref) => {
    if (ref) {
      rowRef.current = ref;
      const currHeight = ref.getBoundingClientRect().height;
      const prevHeight = _.current.rowStyles[viewIndex]?.height;
      if (prevHeight !== currHeight) {
        _.current.rowStyles[viewIndex].height = currHeight;
      }
      if (_.current.initalRender && viewIndex === _.current.size - 1) {
        _.current.initalRender = false;
        render();
      }
    }
  }, []);

  return (
    <div
      ref={rowRefCallback}
      className="flex border-l"
      style={{
        position: "absolute",
        top: _.current.rowStyles?.[viewIndex]?.top || 0,
      }}
    >
      <div className="w-10 border-r border-b items-center justify-center flex">
        {dataIndex + 1}
      </div>
      <div className="w-10 border-r border-b items-center justify-center flex">
        <input type="radio" />
      </div>
      <div className="w-10 border-r border-b items-center justify-center flex">
        <input type="checkbox" />
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: headColumnWidths.join(" "),
        }}
      >
        {bodySchema.map((columnProps, columnIndex) => {
          const { columnCount, rowCount, cells } = columnProps;
          return (
            <div
              key={id + columnIndex}
              className="grid"
              style={{
                gridColumn: `span ${columnCount}`,
                gridRow: `span ${rowCount}`,
                gridTemplateColumns: "subgrid",
                gridTemplateRows: "subgrid",
              }}
            >
              {cells.map((cellProps, cellIndex) => {
                const { binding, columnSpan, rowSpan } = cellProps;
                return (
                  <div
                    key={id + columnIndex + cellIndex}
                    className="min-h-10 border-r border-b break-all flex items-center justify-center"
                    style={{
                      gridColumn: `span ${columnSpan}`,
                      gridRow: `span ${rowSpan}`,
                    }}
                  >
                    {item[binding]}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
