"use client";

import Image from "next/image";
import React from "react";
import styled from "styled-components";

const Container = styled.div<{ $imageurl: unknown }>`
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.18);
  --tw-border-opacity: 1;
  border-radius: ${(props) =>
    props.$imageurl ? "1rem 2rem 2rem 1rem" : "1rem"};
  display: flex;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(255 204 54 / var(--tw-border-opacity));
  padding: ${(props) =>
    props.$imageurl ? "none" : "0.75rem 19px 0.75rem 14px"};
  column-gap: 10px;
  align-items: center;
  /* overflow: hidden; */
  padding-left: 14px;
  position: relative;
`;

const ImaginaryItem = styled.div`
  height: 45px;
  width: 45px;
`;

export default function CategorieItem({
  name,
  imageURL,
}: {
  name: string;
  imageURL?: string;
}) {
  return (
    <Container $imageurl={imageURL ? "true" : undefined}>
      <p className="text-sm font-medium text-[#313638]">{name}</p>
      {imageURL && <ImaginaryItem />}
      {imageURL && (
        <Image
          src={imageURL}
          height={45}
          width={46}
          alt="CategorieImage"
          style={{
            position: "absolute",
            right: "-1px",
            zIndex: "-1",
            borderRadius: "57px",
          }}
        />
      )}
    </Container>
  );
}
