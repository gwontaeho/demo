import { useRef, useEffect } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const $ = use$({ socket: null });

  const socket = () => {
    $.current.socket = io("http://localhost:3002");
  };

  const connect = () => {
    $.current.socket.on("connect", () => {
      console.log("connect");
    });
  };

  const disconnect = () => {
    $.current.socket.on("disconnect", () => {
      console.log("disconnect");
    });
  };

  const emit = (name, param) => {
    $.current.socket.emit(name, param);
  };

  return { socket, connect, disconnect, emit };
};

export { useSocket };
