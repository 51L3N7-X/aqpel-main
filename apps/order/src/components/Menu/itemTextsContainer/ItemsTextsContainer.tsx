/* eslint-disable tailwindcss/no-custom-classname */

"use client";

import type { ItemData } from "@repo/types";
import React from "react";
import styled from "styled-components";

import FireIcon from "@/public/menu/fire.svg";

const Name = styled.h1`
  color: #313638;
  font-size: 22px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Price = styled.h1`
  color: #ffcc36;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const CaloriesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const LineTowDetailText = styled.p<{ $type: "cal" | "person" }>`
  color: #6e6e70;
  font-size: 16px;
  font-style: normal;
  font-weight: ${(props) => (props.$type === "cal" ? "500" : "400")};
  line-height: normal;
`;

const Details = styled.p`
  color: #8e8e8e;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 2px;
`;

export default function ItemsTextsContainer({ item }: { item: ItemData }) {
  return (
    <div className="mx-6 mb-52 mt-11 font-poppins">
      <div className="line1 flex items-center justify-between">
        <Name>{item.name}</Name>
        <Price>{item.price}</Price>
      </div>
      <div className="line2 my-4 flex items-center justify-between">
        {item.calories && (
          <CaloriesContainer>
            <FireIcon style={{ height: "24px", width: "24px" }} />
            <LineTowDetailText $type="cal">
              {item.calories} Calories
            </LineTowDetailText>
          </CaloriesContainer>
        )}
        {item.people && (
          <LineTowDetailText $type="person">
            {item.people} {+item.people > 1 ? "persons" : "person"}
          </LineTowDetailText>
        )}
      </div>
      <h1 className="text-[22px] font-medium text-text">Details</h1>
      {item.description && <Details>{item.description}</Details>}
    </div>
  );
}
