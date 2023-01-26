import { apply, tw } from "@twind/core";
import React from "react";

export type ChipProps = React.ComponentProps<"div">;

export const Chip = ({ className, children, ...props }: ChipProps) => {
  const baseClassName = tw(
    "px-4 py-2 rounded-full text-gray-500 bg-gray-200 font-semibold text-sm flex align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease",
  );
  return (
    <div className={tw(apply(baseClassName, className))} {...props}>
      {children}
    </div>
  );
};
