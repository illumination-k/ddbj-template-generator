import { apply, tw } from "@twind/core";
import React from "react";

export function H2({ className, children }: { className?: string } & React.PropsWithChildren) {
  return (
    <h2 className={tw(apply("text-3xl font-bold mt-1 mb-3 text-gray-800 border-b-1 border-gray-100", className))}>
      {children}
    </h2>
  );
}
