import { useRef, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const ref = useRef({ socket: null });

  const socket = () => {
    ref.current.socket = io("http://localhost:3002");
  };

  const connect = () => {
    ref.current.socket.on("connect", () => {
      console.log("connect");
    });
  };

  const disconnect = () => {
    ref.current.socket.on("disconnect", () => {
      console.log("disconnect");
    });
  };

  const emit = (name, param) => {
    ref.current.socket.emit(name, param);
  };

  return { socket, connect, disconnect, emit };
};

export { useSocket };
