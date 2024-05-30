import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3002");

const useSocket = () => {
    useEffect(() => {
        socket.on("connect", () => {
            console.log("connect");
        });

        socket.on("test2", (data) => {
            console.log(data);
        });

        return () => {
            socket.on("disconnect", () => {
                console.log("disconnect");
            });
        };
    }, []);

    const emit = (name, param) => {
        socket.emit(name, param);
    };

    return { emit };
};

export { useSocket };
