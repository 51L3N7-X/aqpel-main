"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavLink = ({
  href,
  exact,
  children,
  ...props
}: {
  href: string;
  exact: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      {...props}
      style={isActive ? { fill: "#FFCC36" } : { fill: "white" }}
    >
      {children}
    </Link>
  );
};
