"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import React, { useEffect, useRef } from "react";

import { ReactQueryProvider } from "@/app/ReactQueryProvider";
import { socket } from "./socket";
import { ConfigProvider, theme } from "antd";

export default function OrderLayoutPage({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const isSubscribed = useRef(false);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle subscription and events
  useEffect(() => {
    if (isSubscribed.current) return;

    const handleConnect = () => {
      alert("connected");
      if (!isSubscribed.current) {
        socket.emit("subscribe", params.id);
        isSubscribed.current = true;
      }
    };

    const handleDisconnect = () => {
      isSubscribed.current = false;
    };

    // Setup event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Cleanup when component unmounts or ID changes
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      isSubscribed.current = false;
    };
  }, [params.id]);
  return (
    <ReactQueryProvider>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: "#FFCC36",
            },
          }}
        >
          {" "}
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </ReactQueryProvider>
  );
}
