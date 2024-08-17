import { io } from "socket.io-client";

export const socket = io("wss://api.aqpel.online", {
  autoConnect: false,
});

export const waiter = io("wss://api.aqpel.online", {
  autoConnect: false,
});
