import { io } from "socket.io-client";

export const socket = io("wss://aqpelv2.jjjjkkjjjjkkm.repl.co", {
  autoConnect: false,
});

export const waiter = io("wss://aqpelv2.jjjjkkjjjjkkm.repl.co", {
  autoConnect: false,
});
