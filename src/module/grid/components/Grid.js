import { memo, forwardRef } from "react";
import { useGridContext } from "../hooks/useGridContext";
import { useInit } from "../hooks/useInit";
import { GridProvider } from "./GridProvider";
import { Header } from "./Header";
import { Body } from "./Body";
import { Footer } from "./Footer";

const GridComponent = memo(() => {
  console.log("Grid");
  useInit("Grid");
  const { scrollerRefCallback, handleScroll, getSchema, getHeight } =
    useGridContext();
  const height = getHeight();
  const { pagination, header, body } = getSchema();

  const hasHeader = !!header;
  const hasBody = !!body;

  return (
    <div className="w-full">
      <div
        className={
          "w-full overflow-auto text-[14px]" +
          (!hasHeader && hasBody ? " border-t" : "")
        }
        ref={scrollerRefCallback}
        onScroll={handleScroll}
        style={{ height }}
      >
        {hasHeader && <Header />}
        {hasBody && <Body />}
      </div>
      {hasBody && pagination && <Footer />}
    </div>
  );
});

const Grid = forwardRef((props, ref) => {
  return (
    <GridProvider ref={ref} {...props}>
      <GridComponent />
    </GridProvider>
  );
});

export { Grid };
