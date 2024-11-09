"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

export const NavLink = ({
  href,
  exact,
  children,
  ...props
}: {
  href: string;
  exact?: boolean;
  children?: React.ReactNode;
  className?: string;
} & ComponentProps<"div">) => {
  const pathname = usePathname();

  const isActive = exact ? !!pathname.endsWith(href) : false;

  return (
    <div
      // href={href}
      {...props}
      style={{ fill: isActive ? "#FFCC36" : "white", cursor: "pointer" }}
    >
      {children}
    </div>
  );
};
