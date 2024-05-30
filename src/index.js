import "./index.css";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useSocket } from "./socket/socket";

const SocketExample = () => {
    const { emit } = useSocket();
    const handleClick = () => {
        console.log("a");
        emit("test", { data: "asd" });
    };
    return (
        <div>
            <button onClick={handleClick}>g</button>
        </div>
    );
};

function App() {
    const data = [
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
        { a: "a", b: "b", c: "c" },
    ];

    const headSchema = [
        { colspan: 2, id: "test", cells: [{ binding: "text", width: "*", colspan: 2 }] }, //
        { cells: [{ binding: "text", width: 200 }] },
        { cells: [{ binding: "text", width: 200 }] },
        { cells: [{ binding: "text", width: 200 }] },
    ];

    const headTemplate = () => {
        let cols = 0;
        for (const item of headSchema) {
            const { colspan } = item;
            const itemCols = colspan || 1;
            cols += itemCols;

            let widthArray = [];
        }
        console.log(cols);
    };

    headTemplate();

    return (
        <div>
            <div className="grid grid-cols-4">
                {headSchema.map(() => {
                    return <div className="p-4 border"></div>;
                })}
            </div>
        </div>
    );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
