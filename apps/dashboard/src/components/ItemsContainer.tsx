import React from "react";

export default function ItemsContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="my-8 flex flex-wrap gap-6">{children}</div>;
}
