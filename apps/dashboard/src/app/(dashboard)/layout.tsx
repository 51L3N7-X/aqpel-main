"use client";

import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";

import Search from "@/components/Search";
import SettingsButton from "@/components/SettingsButton";
import SideBar from "@/components/SideBar";
import StyledComponentsRegistry from "@/lib/registry";

import CheckRestaurant from "./CheckRestaurant";

const Home = styled.div<{ $close: boolean }>`
  width: ${(props) =>
    props.$close ? "calc(100% - 144px)" : "calc(100% - 310px)"};
  left: ${(props) => (props.$close ? "144px" : "310px")};
  transition: all 0.3s ease;
  min-height: calc(100dvh - 24px);
`;

const queryClient = new QueryClient();

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [close, setClose] = useState<boolean>(false);

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        {/* <MantineProvider theme={theme}> */}
        <StyledComponentsRegistry>
          <CheckRestaurant />
          <SideBar close={close} setClose={setClose} />
          <Home $close={close} className=" absolute top-0">
            <div className="mt-6 flex w-full justify-between">
              <Search />
              <SettingsButton />
            </div>
            {children}
          </Home>
        </StyledComponentsRegistry>
        {/* </MantineProvider> */}
      </NextUIProvider>
    </QueryClientProvider>
  );
}
