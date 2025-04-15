import { io } from "socket.io-client";

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:6969"
    : "https://api.aqpel.online";

export const socket = io(url, {
  autoConnect: false,
});
