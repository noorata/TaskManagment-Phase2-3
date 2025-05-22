import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket(url, onConnect) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(url, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
      onConnect?.(socket);
    });

    return () => socket.disconnect();
  }, [url, onConnect]);

  return socketRef;
}
