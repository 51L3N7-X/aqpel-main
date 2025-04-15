"use client";

import React, { useState } from "react";
import { ConfigProvider, Steps, StepsProps } from "antd";
import "./redesign.css";

import { CheckCircleOutlined, CheckSquareOutlined, FireOutlined, GiftOutlined, LoadingOutlined, NotificationOutlined } from "@ant-design/icons";

export default function ProgressPage() {
  const [current, setCurrent] = useState(0);
  const Items: StepsProps["items"] = [
    {
      title: "Request Sent",
      icon: <NotificationOutlined></NotificationOutlined>,
      description: "Waiter notified! Your order is being processed.",
    },
    {
      title: "Order Confirmed",
      icon: <CheckCircleOutlined />,
      description: "Order sent to the kitchen.",
    },
    {
      title: "Preparing Order",
      icon: <FireOutlined />,
      description: "Chefs are cooking your meal.",
    },
    {
      title: "Ready for Pickup",
      icon: <CheckSquareOutlined />,
      description: "Your order is ready! Waiter is on the way.",
    },
    {
      title: "Order Delivered",
      icon: <GiftOutlined />,
      description: "Enjoy your meal! 🎉",
    },
  ];

  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="text-white">
        <ConfigProvider
          theme={{
            components: {
              Steps: {
                // lineHeight: 4,
                // customIconFontSize: 48,
                // customIconSize: 64,
                // iconFontSize: 56,
                customIconSize: 48,
                iconSize: 48,
                // titleLineHeight: 129,
                // navContentMaxWidth: 100,
              },
            },
          }}
        >
          <Steps
            className="custom-steps"
            ant-steps-item-title
            direction="vertical"
            items={Items}
            current={4}
          ></Steps>
        </ConfigProvider>
      </div>
    </div>
  );
}
