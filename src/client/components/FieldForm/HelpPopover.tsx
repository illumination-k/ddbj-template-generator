import { Popover, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { apply, tw } from "@twind/core";
import { Fragment } from "react";

export type HelpPopoverProps = {
  className?: string;
  help: string;
};

const HelpPopover = ({ className, help }: HelpPopoverProps) => {
  return (
    <div className={tw(apply(className))}>
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button>
              <InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
            </Popover.Button>

            <Popover.Panel
              className={tw(
                apply(
                  "absolute z-10 -top-10 left-1/2 -translate-x-1/2 transform px-4",
                  "bg-blue-200 text-black px-2 py-1 rounded whitespace-nowrap",
                  "before:content-[''] before:absolute before:-translate-x-1/2 before:left-1/2 before:top-full before:border-4 before:border-transparent before:border-t-blue-200",
                ),
              )}
            >
              {help}
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
};

export default HelpPopover;
