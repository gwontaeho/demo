import { memo } from "react";
import { useInit } from "../hooks/useInit";
import { useGridContext } from "../hooks/useGridContext";
import { Pagination } from "./Pagination";
import { Sizer } from "./Sizer";

const Footer = memo(() => {
  console.log("Grid Footer");
  useInit("Footer");
  const { getRef, getSchema, handleSizeChange, handlePageChange } =
    useGridContext();
  const { page, size } = getSchema();
  const { dataCount } = getRef();

  return (
    <div className="min-h-10 bg-gray-100 px-2 flex items-center gap-8">
      <Sizer size={size} onChange={handleSizeChange} />
      <Pagination
        page={page}
        perPage={size}
        count={dataCount}
        onChange={handlePageChange}
      />
    </div>
  );
});

export { Footer };
