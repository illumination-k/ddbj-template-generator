import { apply, tw } from "@twind/core";
import React from "react";

export type InputProps = Omit<React.ComponentProps<"input">, "style">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      {...props}
      className={tw(
        apply(
          "block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400",
          "focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300",
          className,
        ),
      )}
      ref={ref}
    />
  );
});

export default Input;
