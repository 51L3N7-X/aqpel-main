"use client";

import { Tab, Tabs } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SettingsLaoyout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="my-8 pl-4 pr-12">
      <div className="flex w-full flex-col">
        <Tabs
          selectedKey={pathname}
          aria-label="Settings"
          color="primary"
          variant="underlined"
          classNames={{
            tabList:
              "gap-6 w-full rounded-none p-0 border-b border-secondary/40",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-10",
            tabContent:
              "group-data-[selected=true]:text-primary text-medium font-bold ",
          }}
        >
          <Tab
            title={<Link href="/settings/user">User</Link>}
            key="/settings/user"
          />

          <Tab
            title={<Link href="/settings/restaurant">Restaurant</Link>}
            key="/settings/restaurant"
          />
        </Tabs>
      </div>

      {children}
    </div>
  );
}
