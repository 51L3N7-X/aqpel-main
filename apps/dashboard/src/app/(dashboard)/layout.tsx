"use client";

import { useState } from "react";
import styled from "styled-components";

import Search from "@/components/Search";
import SettingsButton from "@/components/SettingsButton";
import SideBar from "@/components/SideBar";
import StyledComponentsRegistry from "@/lib/registry";

const Home = styled.div<{ $close: boolean }>`
  width: ${(props) =>
    props.$close ? "calc(100% - 144px)" : "calc(100% - 310px)"};
  left: ${(props) => (props.$close ? "144px" : "310px")};
  transition: all 0.3s ease;
  min-height: calc(100dvh - 24px);
`;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [close, setClose] = useState<boolean>(false);

  return (
    <StyledComponentsRegistry>
      <SideBar close={close} setClose={setClose} />
      <Home $close={close} className=" absolute top-0">
        <div className="mt-6 flex w-full justify-between">
          <Search />
          <SettingsButton />
        </div>
        {children}
      </Home>
    </StyledComponentsRegistry>
  );
}
