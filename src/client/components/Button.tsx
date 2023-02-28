import { apply, tw } from "@twind/core";
import React from "react";

type ButtonColor = "primary" | "secondary" | "danger";

const buttonColorMap: { [key in ButtonColor]: string } = {
  primary: "text-white bg-blue-600 hover:bg-blue-500 ring-blue-300",
  secondary: "text-white bg-green-600 hover:bg-green-500 ring-green-300",
  danger: "text-white bg-red-600 hover:bg-red-500 ring-red-300",
};

type Props = React.ComponentProps<"button"> & { color?: ButtonColor };

export const Button = ({ className, children, type = "button", color = "primary", ...props }: Props) => {
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
    "rounded-md",
    "focus:outline-none focus:ring focus:ring-opacity-80",
    buttonColorMap[color],
  ]));

  return (
    <button type={type} {...props} className={tw(apply(baseClassName, className))}>
      {children}
    </button>
  );
};
