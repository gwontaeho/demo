import { forwardRef, useRef, useCallback } from "react";
import { GridContext } from "../utils/context";
import { debounce, uuid, cloneDeep } from "../utils/utils";

const Provider = forwardRef((props, ref) => {
  const { children } = props;

  const _ = useRef(ref).current;

  const _context = useRef({
    keyBase: uuid(),
    overscanCount: 40,
    rowMinHeight: 32,
    scrollerRef: null,
    rowMetricsEditable: [],
    rowMetricsNonEditable: [],
  }).current;

  const _readjust = useCallback(
    debounce(() => {
      const rowMetrics = _.schema.editable
        ? _context.rowMetricsEditable
        : _context.rowMetricsNonEditable;
      rowMetrics
        .slice(0, _.schema.pagination ? _.schema.size : undefined)
        .reduce((prev, curr) => {
          curr.top = prev;
          return prev + curr.height;
        }, 0);
      _.renderBody?.();
    }, 100),
    []
  );

  const _method = useRef({
    scrollerRefCallback: (ref) => {
      _context.scrollerRef = ref;
    },
    // handleScroll: throttle(() => {
    //   _readjust();
    // }, 100),
    handleScroll: _readjust,
    init: (type, forceUpdate) => {
      _["render" + type] = forceUpdate;
    },
    getRef: () => {
      return _;
    },
    getKeyBase: () => {
      return _context.keyBase;
    },
    getSchema: () => {
      return _.schema;
    },
    getHeight: () => {
      return (
        _.schema.height && _.schema.height - (_.schema.pagination ? 40 : 0)
      );
    },
    getGridTemplate: (type) => {
      const { headerWidths, headerRowCount, bodyWidths, bodyRowCount } =
        _.schema;
      return {
        gridTemplateColumns: (_.schema.header ? headerWidths : bodyWidths).join(
          " "
        ),
        gridTemplateRows: `repeat(${
          type === "header" ? headerRowCount : bodyRowCount
        }, minmax(32px, auto))`,
      };
    },
    getRows: () => {
      let rows = Array.from({ length: _.dataCount });

      const { page, size, pagination, height, editable } = _.schema;
      const {
        overscanCount,
        rowMinHeight,
        scrollerRef,
        rowMetricsEditable,
        rowMetricsNonEditable,
      } = _context;

      const pageable = pagination && pagination !== "external";

      // Paginate
      pageable && (rows = rows.slice(page * size, (page + 1) * size));

      const rowMetrics = editable ? rowMetricsEditable : rowMetricsNonEditable;
      const topIndex = Math.max(
        rowMetrics.findIndex(({ top }) => (scrollerRef?.scrollTop ?? 0) <= top),
        0
      );
      const firstIndex = Math.max(topIndex - overscanCount, 0);
      const lastIndex = Math.min(
        topIndex + Math.ceil(height / rowMinHeight) + overscanCount,
        rows.length
      );

      // Slice
      height && (rows = rows.slice(firstIndex, lastIndex));

      const viewIndexOffset = height ? firstIndex : 0;
      const dataIndexOffset = pageable ? page * size : 0;

      return { rows, viewIndexOffset, dataIndexOffset, rowMetrics };
    },
    createObserver: (index) => {
      const { editable } = _.schema;
      const { rowMetricsEditable, rowMetricsNonEditable } = _context;
      const rowMetrics = editable ? rowMetricsEditable : rowMetricsNonEditable;
      return new ResizeObserver((entries) => {
        for (const entry of entries) {
          const height = entry.contentRect.height;
          const rowMetric = (rowMetrics[index] ??= {});
          if (rowMetric.height !== height) {
            rowMetric.height = height;
            _readjust();
          }
        }
      });
    },
    handleSizeChange: (value) => {
      if (
        !_.schema.pagination ||
        typeof value !== "number" ||
        _.schema.size === value
      )
        return;
      _.schema.page = 0;
      _.schema.size = value;
      if (_.schema.pagination !== "external") _.renderBody?.();
      _.renderFooter?.();
    },
    handlePageChange: (value) => {
      if (
        !_.schema.pagination ||
        typeof value !== "number" ||
        _.schema.page === value
      )
        return;
      _.schema.page = value;
      if (_.schema.pagination !== "external") _.renderBody?.();
      _.renderFooter?.();
    },
    handleRadioChange: (dataIndex) => {
      _.radioData = _.data[dataIndex];
    },
    handleCheckboxChange: (dataIndex) => {
      const checkboxData = _.checkboxData;
      const row = _.data[dataIndex];
      const found = checkboxData.findIndex((item) => item === row);
      found === -1 ? checkboxData.push(row) : checkboxData.splice(found, 1);
    },
    handleRowChange: (dataIndex, field, value) => {
      _.data[dataIndex][field] = value;
    },
  }).current;

  return (
    <GridContext.Provider value={_method}>{children}</GridContext.Provider>
  );
});

export { Provider };
