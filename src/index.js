import "./index.css";
import { createRoot } from "react-dom/client";
import { Grid } from "./grid/Grid";

function App() {
  return (
    <div>
      <Grid />
    </div>
  );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
