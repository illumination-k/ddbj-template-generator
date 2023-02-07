import { apply, tw } from "@twind/core";
import React from "react";

import HelpPopover from "./HelpPopover";

export type LabelWithHelpProps = {
  className?: string;
  label: React.ReactNode;
  help?: string;
  comment?: string;
  required?: boolean;
} & React.PropsWithChildren;

const LabelWithHelp = ({ className, comment, label, help, required = false, children }: LabelWithHelpProps) => {
  return (
    <div className={tw(apply("my-2", className))}>
      <div className={tw("flex justify-between")}>
        <label className="flex">
          {required ? <p className={tw("text-red-600")}>*</p> : <></>}
          <p className="px-1">{label}</p>
          {comment ? <p>({comment})</p> : <></>}
        </label>

        {help
          ? <HelpPopover help={help} />
          : <></>}
      </div>
      {children}
    </div>
  );
};

export default LabelWithHelp;
