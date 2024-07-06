import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  createContext,
  useReducer,
  useContext,
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

const data = Array(100)
  .fill(null)
  .map((_, index) => {
    return { index, a: "a", b: "b", c: (Math.random() * 100).toFixed() };
  });

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
        { binding: "a1" },
        { binding: "a2", rowSpan: 2 },
        { binding: "a3" },
        { binding: "a4" },
        { binding: "a5" },
        { binding: "a6", columnSpan: 2 },
      ],
    },
    {
      id: "b",
      rowCount: 4,
      cells: [
        { binding: "bbbb" },
        { binding: "b" },
        { binding: "b", rowSpan: 2 },
      ],
    },
    { id: "c", rowCount: 4, cells: [{ binding: "c", rowSpan: 4 }] },
    { id: "c", rowCount: 4, cells: [{ binding: "c", rowSpan: 4 }] },
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
    { rowCount: 2, cells: [{ binding: "b" }, { binding: "b" }] },
    { rowCount: 2, cells: [{ binding: "c", rowSpan: 2 }] },
    { rowCount: 2, cells: [{ binding: "c", rowSpan: 2 }] },
  ],
};

const GridContext = createContext({ startIndex: 0, endIndex: 10 });
const useGridContext = () => useContext(GridContext);
const GridContextProvider = ({ children }) => {
  const _ = useRef({
    rowStyles: [],
    topIndex: 0,
    startIndex: 0,
    endIndex: 30,
    overscanCount: 20,
    totalDataCount: data.length,
  });

  const [, setRenderingCount] = useState(0);

  const render = debounce(() => {
    setRenderingCount((prev) => (prev += 1));
  }, 500);

  const handleScroll = (event) => {
    try {
      let topIndex = _.current.rowStyles.findIndex(
        ({ top, height }) => event.target.scrollTop < top + height
      );

      _.current.topIndex = topIndex;
      _.current.startIndex = topIndex - _.current.overscanCount;
      _.current.endIndex =
        _.current.topIndex +
        _.current.overscanCount +
        Math.ceil(
          (event.target.getBoundingClientRect().height -
            _.current.headRef.getBoundingClientRect().height) /
            _.current.rowStyles[topIndex].height
        );
      if (_.current.startIndex < 0) {
        _.current.startIndex = 0;
      }
      if (_.current.endIndex > 100) {
        _.current.endIndex = 100;
      }

      setRenderingCount((prev) => (prev += 1));
    } catch (error) {}
  };

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

  const value = {
    _,
    headSchema,
    bodySchema,
    headColumnWidths,
    handleScroll,
    render,
  };

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};

export const Grid = () => {
  return (
    <GridContextProvider>
      <GridComponent />
    </GridContextProvider>
  );
};

const GridComponent = () => {
  const id = useId();

  const { _, handleScroll, headColumnWidths, headSchema } = useGridContext();

  const test = data.slice(_.current.startIndex, _.current.endIndex);

  const height = _.current.rowStyles.reduce((prev, curr, index) => {
    curr.top = prev;
    return prev + (curr.height || 0);
  }, 0);

  // console.log(_.current.rowStyles);

  return (
    <div className="p-10">
      <div className="h-[600px] overflow-auto" onScroll={handleScroll}>
        {/* head */}
        <div
          ref={(ref) => {
            _.current.headRef = ref;
          }}
          className="grid border-l border-t sticky top-0 left-0 w-max bg-slate-100 z-[1]"
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
                      className="min-h-10 border-r border-b break-all"
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
        <div
          ref={(ref) => {
            _.current.bodyRef = ref;
          }}
          className="relative"
          style={{ height }}
        >
          {/* body */}
          {test.map((item, index) => {
            return <Row key={id + item.index} item={item} index={index} />;
          })}
        </div>
      </div>
    </div>
  );
};

const Row = (props) => {
  const { _, bodySchema, headColumnWidths, render } = useGridContext();
  const { item, index } = props;
  const tt = index;

  const id = useId();
  const rowRef = useRef();

  useEffect(() => {
    let init = false;
    const resizeObserver = new ResizeObserver((entries) => {
      if (init) {
        for (const entry of entries) {
          try {
            console.log("resize!");
            console.log(_.current.startIndex + index);
            const prevHeight =
              _.current.rowStyles[_.current.startIndex + index].height;
            const height = entry.contentBoxSize[0].blockSize;

            if (prevHeight !== height) {
              const style = { height };
              _.current.rowStyles[_.current.startIndex + index] = style;
              render();
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        init = true;
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

      const prevHeight =
        _.current.rowStyles[_.current.startIndex + index]?.height;
      const height = ref.getBoundingClientRect().height;
      if (prevHeight !== height) {
        const style = { height };
        _.current.rowStyles[_.current.startIndex + index] = style;
        render();
      }
    }
  }, []);

  return (
    <div
      ref={rowRefCallback}
      className="grid border-l"
      style={{
        gridTemplateColumns: headColumnWidths.join(" "),
        position: "absolute",
        top: _.current.rowStyles[_.current.startIndex + index]?.top || 0,
      }}
    >
      {bodySchema.map((columnProps, index) => {
        const { columnCount, rowCount, cells } = columnProps;
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
                  className="min-h-10 border-r border-b break-all"
                  style={{
                    gridColumn: `span ${columnSpan}`,
                    gridRow: `span ${rowSpan}`,
                  }}
                >
                  <textarea />
                  {_.current.startIndex + tt}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
