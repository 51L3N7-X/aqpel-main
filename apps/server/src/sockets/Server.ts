// const { App } = require("uWebSockets.js");
import { Socket, Server as SocketServer } from "socket.io";
import Connection from "./listeners/SokcetManager";
import http from "http";
import redis from "redis";

export class SocketServerClass {
  public server: http.Server;
  public io: SocketServer;
  constructor(server: http.Server) {
    this.server = server;
    // this.app = App();
    this.io = new SocketServer(this.server, {
      allowUpgrades: true,
      cors: {
        origin: "http://localhost:3000",
      },
    });
  }

  async init() {
    // // this.io.attachApp(this.app);
    // const redisClientPub = redis.createClient();
    // await redisClientPub.connect();

    // // creating a redis subscriber
    // const redisClientSub = redisClientPub.duplicate();
    // await redisClientSub.connect();

    this.io.on("connection", (socket) => Connection(socket, this.io));
  }
}
