// @ts-nocheck
const { io } = require("socket.io-client");

const user = io("wss://aqpelv2.jjjjkkjjjjkkm.repl.co");
const waiter = io("wss://aqpelv2.jjjjkkjjjjkkm.repl.co");

// user.emit("order:create", { test: 10 });
// user.on("user", (test) => console.log(test));

user.emit("subscribe", "64fdf84b05660bd1125ea15c");
waiter.emit("subscribe", [
  "64fdf84b05660bd1125ea15c",
  "64fdf86105660bd1125ea160",
  "64fdf86b05660bd1125ea162",
  "64fdf87705660bd1125ea164",
  "64fdf8a505660bd1125ea167",
  "64fdf8af05660bd1125ea169",
  "64fdf8b605660bd1125ea16b",
  "64fdf8c005660bd1125ea16d",
  "64fdf8c705660bd1125ea16f",
  "64fdf8d005660bd1125ea171",
]);

user.emit("order:create", {
  type: "waiter",
  restaurant_id: "64fdf7e105660bd1125ea159",
  table_id: "64fdf84b05660bd1125ea15c",
});

waiter.on("waiter:order", (order) => {
  console.log(order);
});

waiter.emit("waiter:orderDone", {
  orderId: "64fe167e6ae14ba0ec34a086",
  name: "Hossam",
  photoUrl:
    "https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png",
});

waiter.on("waiter:notfiyOrderIsDone", (user) => console.log(user));

user.on("user", (m) => console.log(m));
