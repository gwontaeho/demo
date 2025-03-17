import { memo, forwardRef } from "react";
import { useGridContext } from "../hooks/useGridContext";
import { useInit } from "../hooks/useInit";
import { Provider } from "./Provider";
import { Header } from "./Header";
import { Body } from "./Body";
import { Footer } from "./Footer";

const GridComponent = memo(() => {
  console.log("Grid");
  useInit("Grid");
  const {
    scrollerRefCallback,
    handleScroll,
    getSchema,
    getHeight,
    hasHeader,
    hasBody,
  } = useGridContext();
  const height = getHeight();
  const { pagination } = getSchema();

  return (
    <div className="w-full">
      <div
        className="w-full overflow-auto text-[14px]"
        ref={scrollerRefCallback}
        onScroll={handleScroll}
        style={{ height }}
      >
        {hasHeader() && <Header />}
        {hasBody() && <Body />}
      </div>
      {hasBody() && pagination && <Footer />}
    </div>
  );
});

const Grid = forwardRef((props, ref) => {
  return (
    <Provider ref={ref} {...props}>
      <GridComponent />
    </Provider>
  );
});

export { Grid };
