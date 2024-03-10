"use client";

import type { ItemData } from "@repo/types";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

const TextContainer = styled.div<{ $item: ItemData }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: ${(props) => (props.$item.ingredients ? "60px" : "70px")};
`;

const CaloriesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px 0;
  gap: 4px;
`;

const CaloriesText = styled.p`
  --tw-text-opacity: 1;
  font-size: 8px;
  font-weight: 500;
  color: rgb(142 142 142 / var(--tw-text-opacity));
`;

const PeopleText = styled.p`
  --tw-text-opacity: 1;
  font-size: 8px;
  color: rgb(142 142 142 / var(--tw-text-opacity));
`;

export default function Item({ item }: { item: ItemData }) {
  // const [store, setStore] = useState<FavStore>();

  // useEffect(() => {
  //   let s = new FavStore();
  //   setStore(s);
  // }, []);
  return (
    <div className="relative h-[167px] w-[120px] justify-self-center rounded-2xl bg-[#FBFAF6] font-poppins shadow-[-1px_4px_4px_1px_rgba(172,172,172,0.25)]">
      <Image
        src="/menu/item.jpg"
        alt=""
        width={118}
        height={114}
        className="absolute left-[-8px] top-[-16px] rounded-[118px]"
        style={{ width: "96px", height: "96px" }}
        priority
      />
      {/* {item.imageUrl && <Image src={`http://localhost:3000/menu/img.png`} alt="" />} */}
      <div className="flex justify-end">
        <div className="ml-auto mr-[9px] mt-[10px]">
          <div className="flex flex-col flex-wrap gap-2">
            <Image
              src="/menu/Heart.svg"
              alt="add to fav"
              width={10}
              height={10}
              className="shrink-0"
            />
            <Image
              src="/menu/shopping-cart.svg"
              alt="add to cart"
              width={10}
              height={10}
              className="shrink-0"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>
      </div>
      <TextContainer $item={item}>
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <div className="header-texts flex flex-col items-center justify-center">
          <p className="text-[#313638} font-poppins text-[10px]">{item.name}</p>
          {item.ingredients && (
            <p className="text-[8px] font-medium text-[#8E8E8E]">
              Rice | Chickin | Nuts
            </p>
          )}
        </div>
        {item.calories && (
          <CaloriesContainer>
            <Image
              width={20}
              height={20}
              alt="Calories"
              src="/menu/fire.svg"
              style={{ width: "12px", height: "12px" }}
            />
            <CaloriesText className="text-[8px] font-medium  text-[#8E8E8E]">
              {item.calories} Calories
            </CaloriesText>
          </CaloriesContainer>
        )}
        {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
        <div className="fotter flex h-4 w-24 items-center justify-between ">
          {item.people && (
            <PeopleText className="text-[8px] text-[#6E6E70]">
              {item.people} {item.people > "1" ? "Persons" : "Person"}
            </PeopleText>
          )}
          <p className="ml-auto text-[10px] font-semibold text-[#FFCC36]">
            {item.price} SR
          </p>
        </div>
      </TextContainer>
    </div>
  );
}
