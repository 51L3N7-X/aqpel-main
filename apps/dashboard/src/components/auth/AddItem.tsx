"use client";

import Image from "next/image";
import React from "react";
import styled from "styled-components";

const AddItemElement = styled.div`
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='20' ry='20' stroke='%230098AAFF' stroke-width='4' stroke-dasharray='21' stroke-dashoffset='13' stroke-linecap='round'/%3e%3c/svg%3e");
  border-radius: 20px;
`;

export default function AddItem({
  text,
  onClick,
}: {
  text: string;
  onClick: any;
}) {
  return (
    <AddItemElement
      onClick={onClick}
      className="flex h-[288px] w-[250px] cursor-pointer flex-row items-center justify-center rounded-[20px] text-primary"
    >
      <div className="flex flex-col items-center">
        <Image
          className=""
          src="/AddIcon.svg"
          alt="add item"
          width={50}
          height={50}
        />
        <p className=" mt-6 text-[22px] font-bold">{text}</p>
      </div>
    </AddItemElement>
  );
}
