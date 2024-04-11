import "./index.css";
import { createRoot } from "react-dom/client";

function App() {
    return <h1 className="text-blue-600">demo</h1>;
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
