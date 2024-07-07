import "./index.css";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { Grid } from "./grid/Grid";

const useGrid = () => {
  const getData = () => {};
  const getChecked = () => {};
  const getSelectedRow = () => {};
  const getSelectedCell = () => {};
};

const data = Array(99)
  .fill(null)
  .map((_, index) => {
    return { index, a: "a", b: "b", c: (Math.random() * 100).toFixed() };
  });

function App() {
  const [test, setTest] = useState(0);
  return (
    <div>
      {test}
      <button onClick={() => setTest((prev) => ++prev)}>up</button>
      <div className="p-4">
        <Grid data={data} />
      </div>
    </div>
  );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
