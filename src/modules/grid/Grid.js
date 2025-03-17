import { memo, forwardRef } from "react";
import { useGridContext } from "./hooks/useGridContext";
import { useInit } from "./hooks/useInit";
import { Provider } from "./components/Provider";
import { Header } from "./components/Header";
import { Body } from "./components/Body";
import { Footer } from "./components/Footer";

const GridComponent = memo(() => {
  console.log("Grid");
  useInit("Grid");
  const { scrollerRefCallback, handleScroll, getSchema, getHeight } =
    useGridContext();
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
        <Header />
        <Body />
      </div>
      {pagination && <Footer />}
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
