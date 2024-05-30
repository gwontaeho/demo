import "./index.css";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import { useSocket } from "./socket/socket";

function App() {
    const { emit } = useSocket();

    useEffect(() => {
        getExample();
    }, []);

    const getExample = async () => {
        try {
            const response = await axios.get("http://localhost:3001");
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClick = () => {
        console.log("a");
        emit("test", { data: "asd" });
    };

    return (
        <h1 className="text-blue-600">
            <button onClick={handleClick}>g</button>
        </h1>
    );
}

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<App />);
