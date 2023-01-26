import { Disclosure } from "@headlessui/react";

import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { apply, tw } from "@twind/core";
import { useState } from "react";

type DisclosureContent = {
  title: string;
  content: React.ReactNode;
  defaultOpen: boolean;
};

export type FormDisclosureProps = {
  className?: string;
  contents: DisclosureContent[];
};

const FormDisclosure = ({ className, contents }: FormDisclosureProps) => {
  return (
    <div className={tw(apply("w-full pt-16", className))}>
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
        {contents.map((c, i) => {
          return (
            <Disclosure key={i} defaultOpen={c.defaultOpen}>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={tw(
                      apply(
                        "flex w-full justify-between rounded-lg bg-purple-100 px-2 py-2 mb-5 text-left text-sm font-medium text-purple-900",
                        "hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                      ),
                    )}
                  >
                    <span>{c.title}</span>
                    <ChevronUpIcon
                      className={tw(apply("h-5 w-5 text-purple-500", open ? "rotate-180 transform" : ""))}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    {c.content}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          );
        })}
      </div>
    </div>
  );
};

export default FormDisclosure;
