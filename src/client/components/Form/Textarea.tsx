import { apply, tw } from "@twind/core";
import React from "react";

type TextareaProps = React.ComponentProps<"textarea">;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      {...props}
      className={tw(
        apply("block w-full px-2 rounded-md border focus:outline-none focus:ring focus:ring-blue-300", className),
      )}
      ref={ref}
    />
  );
});

export default Textarea;
