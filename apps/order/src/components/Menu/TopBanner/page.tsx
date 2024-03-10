"use client";

import Image from "next/image";
import React from "react";
import styled from "styled-components";

import Search from "../Search/Search";

const PointsContainer = styled.div`
  --tw-text-opacity: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgb(245 245 245 / var(--tw-text-opacity));
  width: 100%;
`;

const PointText = styled.p`
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
`;

export default function TopBanner() {
  // { points }: { points?: string }
  return (
    <div className="mx-auto overflow-hidden rounded-b-[20px] bg-[#1B1E21]">
      {/* eslint-disable-next-line */}
      <div className="containter px-4">
        {/* eslint-disable-next-line */}
        <div className="navBar mb-[18px] mt-8 flex w-full items-center justify-between">
          <Image
            src="/order/images/logo.svg"
            alt="logo"
            height={44}
            width={44}
          />
          <Image
            src="/order/images/burger-menu.svg"
            alt="menu"
            height={44}
            width={44}
          />
        </div>
        {true && (
          <PointsContainer>
            <PointText>Your Points</PointText>
            <PointText>10 SR</PointText>
          </PointsContainer>
        )}
        <Search />
      </div>
    </div>
  );
}
