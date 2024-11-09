"use client";

import "./test.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import Button from "../Button/Button";
import Buttons from "../Buttons/Buttons";
import Loading from "../Loading/Loading";
import NavBar from "../NavBar/Navbar";
import Received from "../Received/Received";
import style from "./order.module.css";
import { socket } from "./socket.ts";

export default function Order({
  params,
  table,
  restaurant,
}: {
  params: { id: string };
  table: any;
  restaurant: any;
}) {
  const pathname = usePathname();
  const [, setIsConnected] = useState(socket.connected);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isOrderReceived, setIsOrderReceived] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callingType, setCallingType] = useState("");
  const [receivedData, setReceivedData] = useState<any>({});

  useEffect(() => {
    socket.connect();
    // waiter.connect();

    socket.emit("subscribe", String(params.id));
    // waiter.emit("subscribe", [String(params.id)]);

    function onDone({ name, photoUrl }: { name: string; photoUrl: string }) {
      setIsLoading(() => false);
      setIsOrderReceived(() => true);
      setReceivedData({ name, photoUrl });
    }

    function onUser(data: any) {
      console.log(data);
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("waiter:notifyOrderIsDone", onDone);
    socket.on("user", onUser);

    localStorage.setItem("table", JSON.stringify(table));
    localStorage.setItem("restaurant", JSON.stringify(restaurant));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("waiter:notifyOrderIsDone", onDone);
      socket.off("user", onUser);
    };
  }, [params.id, table]);

  function onOrder(type: string) {
    if (type === "Menu") {
      return;
      // router.prefetch(`${params.id}/menu`);
    }

    setCallingType(type);
    setIsButtonPressed(true);
    setIsLoading(true);

    const order = {
      type: type.toLowerCase(),
      restaurant_id: table.restaurantId,
      table_id: params.id,
      table_number: table.number,
    };
    socket.emit("order:create", order);

    //   setTimeout(() => {
    //  waiter.emit("waiter:orderDone", {
    //    orderId: "64fe167e6ae14ba0ec34a086",
    //    name: "Hossam",
    //    photoUrl:
    //      "https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png",
    //  });
    //   } ,3000)

    // setTimeout(() => {
    //   setIsLoading((current) => !current);
    //   setIsOrderReceived((current) => !current);
    // }, 3000);
  }

  const onCardClick = () => {
    setIsOrderReceived(false);
    setIsButtonPressed(false);
  };

  return (
    <div className="parent relative">
      <div className={style.wrapper}>
        <NavBar />
        <Buttons
          style={{
            display: isButtonPressed ? "none" : "flex",
            animation: isButtonPressed ? "fade-in 1s" : "fade-out",
          }}
        >
          <Button
            name="Call Waiter"
            imageName="waiter"
            onClick={() => onOrder("Waiter")}
          />
          <Link href={`${pathname}/menu`}>
            <Button
              name="Menu"
              imageName="menu"
              onClick={() => onOrder("Menu")}
            />
          </Link>
          <Button
            name="Bill"
            imageName="bill"
            onClick={() => onOrder("Bill")}
          />
          <Button
            name="Embers"
            imageName="embers"
            onClick={() => onOrder("Embers")}
          />
        </Buttons>
        {/* <Suspense
          fallback={
            <Loading
              name={callingName}
              style={{ display: isButtonBressed ? "block" : "none" }}
            />
          }
        >
          <Received></Received>
        </Suspense> */}

        <Loading
          name={callingType}
          style={{ display: isLoading ? "flex" : "none" }}
        />
        <Received
          name={receivedData.name}
          tableNumber={table.number}
          imageLink={receivedData.photoUrl}
          style={{ display: isOrderReceived ? "flex" : "none" }}
          onClick={onCardClick}
        />
      </div>
      <div className={style.background} />
      {/* <Image
        className={style.steam}
        src="/order/images/steam.png"
        alt="steam"
        width={757}
        height={591}
      ></Image> */}
    </div>
  );
}
