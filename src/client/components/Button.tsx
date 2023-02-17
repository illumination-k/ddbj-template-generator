import { apply, tw } from "@twind/core";
import React from "react";

type Props = React.ComponentProps<"button">;

export const Button = ({ className, children, type = "button", ...props }: Props) => {
  const baseClassName = tw(apply([
    "px-4",
    "py-2",
    "font-medium",
    "tracking-wide",
    "text-white",
    "capitalize",
    "transition-colors",
    "duration-200",
    "transform",
    "bg-blue-600",
    "rounded-md",
    "hover:bg-blue-500",
    {
      focus: ["outline-none", "ring", "ring-blue-300", "ring-opacity-80"],
    },
  ]));

  return (
    <button type={type} {...props} className={tw(apply(baseClassName, className))}>
      {children}
    </button>
  );
};
