import utils from "../utils";

const GRID_COLS = {
  0: "",
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
  subgrid: "grid-cols-subgrid",
};
const GRID_ROWS = {
  0: "",
  1: "grid-rows-1",
  2: "grid-rows-2",
  3: "grid-rows-3",
  4: "grid-rows-4",
  5: "grid-rows-5",
  6: "grid-rows-6",
  7: "grid-rows-7",
  8: "grid-rows-8",
  9: "grid-rows-9",
  10: "grid-rows-10",
  11: "grid-rows-11",
  12: "grid-rows-12",
  subgrid: "grid-rows-subgrid",
};
const FLEX_DIRECTION = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse",
};
const FLEX_WRAP = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};
const JUSTIFY_CONTENT = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
  stretch: "justify-stretch",
  normal: "justify-normal",
};
const ALIGN_ITEMS = {
  stretch: "items-stretch",
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
};
const COL_SPAN = {
  0: "",
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
  full: "col-span-full",
};
const ROW_SPAN = {
  0: "",
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
  7: "row-span-7",
  8: "row-span-8",
  9: "row-span-9",
  10: "row-span-10",
  11: "row-span-11",
  12: "row-span-12",
  full: "row-span-full",
};
const GAP = {
  0: "",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  7: "gap-7",
  8: "gap-8",
  9: "gap-9",
  10: "gap-10",
};
const GAP_X = {
  0: "",
  1: "gap-x-1",
  2: "gap-x-2",
  3: "gap-x-3",
  4: "gap-x-4",
  5: "gap-x-5",
  6: "gap-x-6",
  7: "gap-x-7",
  8: "gap-x-8",
  9: "gap-x-9",
  10: "gap-x-10",
};
const GAP_Y = {
  0: "",
  1: "gap-y-1",
  2: "gap-y-2",
  3: "gap-y-3",
  4: "gap-y-4",
  5: "gap-y-5",
  6: "gap-y-6",
  7: "gap-y-7",
  8: "gap-y-8",
  9: "gap-y-9",
  10: "gap-y-10",
};
const PADDING = {
  0: "",
  1: "p-1",
  2: "p-2",
  3: "p-3",
  4: "p-4",
  5: "p-5",
  6: "p-6",
  7: "p-7",
  8: "p-8",
  9: "p-9",
  10: "p-10",
};
const PADDING_X = {
  0: "",
  1: "px-1",
  2: "px-2",
  3: "px-3",
  4: "px-4",
  5: "px-5",
  6: "px-6",
  7: "px-7",
  8: "px-8",
  9: "px-9",
  10: "px-10",
};
const PADDING_Y = {
  0: "",
  1: "py-1",
  2: "py-2",
  3: "py-3",
  4: "py-4",
  5: "py-5",
  6: "py-6",
  7: "py-7",
  8: "py-8",
  9: "py-9",
  10: "py-10",
};
const MARGIN = {
  0: "",
  1: "m-1",
  2: "m-2",
  3: "m-3",
  4: "m-4",
  5: "m-5",
  6: "m-6",
  7: "m-7",
  8: "m-8",
  9: "m-9",
  10: "m-10",
  auto: "m-auto",
};
const MARGIN_X = {
  0: "",
  1: "mx-1",
  2: "mx-2",
  3: "mx-3",
  4: "mx-4",
  5: "mx-5",
  6: "mx-6",
  7: "mx-7",
  8: "mx-8",
  9: "mx-9",
  10: "mx-10",
  auto: "mx-auto",
};
const MARGIN_Y = {
  0: "",
  1: "my-1",
  2: "my-2",
  3: "my-3",
  4: "my-4",
  5: "my-5",
  6: "my-6",
  7: "my-7",
  8: "my-8",
  9: "my-9",
  10: "my-10",
  auto: "my-auto",
};
const GROW = {
  0: "",
  1: "grow-[1]",
  2: "grow-[2]",
  3: "grow-[3]",
  4: "grow-[4]",
  5: "grow-[5]",
  6: "grow-[6]",
  7: "grow-[7]",
  8: "grow-[8]",
  9: "grow-[9]",
  10: "grow-[10]",
};

export const Layout = (props) => {
  const {
    children,
    width,
    height,

    g,
    gx,
    gy,
    p,
    px,
    py,
    m,
    mx,
    my,
    border,

    flex,
    direction,
    justifyContent,
    alignItems,
    wrap,
    grow,

    grid,
    cols,
    rows,
    colSpan,
    rowSpan,
  } = props;

  return (
    <div
      style={{ width, height }}
      className={utils.classNames(
        g && GAP[g],
        gx && GAP_X[gx],
        gy && GAP_Y[gy],
        p && PADDING[p],
        px && PADDING_X[px],
        py && PADDING_Y[py],
        m && MARGIN[m],
        mx && MARGIN_X[mx],
        my && MARGIN_Y[my],
        border && "border",

        flex && "flex",
        direction && FLEX_DIRECTION[direction],
        justifyContent && JUSTIFY_CONTENT[justifyContent],
        alignItems && ALIGN_ITEMS[alignItems],
        wrap && FLEX_WRAP[wrap],
        grow && GROW[grow],

        grid && "grid",
        cols && GRID_COLS[cols],
        rows && GRID_ROWS[rows],
        colSpan && COL_SPAN[colSpan],
        rowSpan && ROW_SPAN[rowSpan]
      )}
    >
      {children}
    </div>
  );
};
