import React from "react";

export default function FieldHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h1 className="mb-1 mt-3 text-2xl font-bold">{children}</h1>;
}
