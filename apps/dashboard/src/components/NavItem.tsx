import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styled from "styled-components";

const Container = styled.div<{ $selected: boolean }>`
  background-color: ${(props) => props.$selected && "#46B5C2"};
  position: relative;

  &:before {
    content: "";
    opacity: ${(props) => (props.$selected ? 1 : 0)};
    position: absolute;
    width: 6px;
    height: 40px;
    border-radius: 0px 2px 2px 0px;
    background-color: #f6f6f6;
    left: -3px;
  }
`;

export default function NavItem({
  text,
  href,
  IconSrc,
  close,
}: {
  text: string;
  href: string;
  IconSrc: string;
  close: boolean;
}) {
  const path = usePathname();

  return (
    <Link href={href}>
      <Container
        $selected={path === href}
        // eslint-disable-next-line tailwindcss/classnames-order
        className="hover:bg-secondary flex h-[52px] flex-row items-center space-x-3 rounded-md  px-8 text-white1"
      >
        <Image
          className="size-6"
          alt="icon"
          src={`/${IconSrc}.svg`}
          width={24}
          height={24}
        />
        {!close && <p className="text-[22px] font-bold">{text}</p>}
      </Container>
    </Link>
  );
}
