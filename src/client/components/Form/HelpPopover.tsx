import { Popover } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { apply, tw } from "@twind/core";

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
                  "absolute z-10 -top-10 left-1/2 w-[500px] -translate-x-1/2 transform px-4",
                  "bg-blue-200 text-black px-4 py-1 rounded",
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
