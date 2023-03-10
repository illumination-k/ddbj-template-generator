import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { tw } from "@twind/core";
import { useEffect, useState } from "react";
import { useController, UseControllerProps } from "react-hook-form";

export type ListBoxOption = string;

export type ListBoxProps = {
  className?: string;
  options: ListBoxOption[];
  defaultOption?: ListBoxOption;
  onChange?: (value: ListBoxOption) => void;
} & UseControllerProps;

export const ListBox = ({
  className,
  options,
  defaultOption,
  onChange = (value) => {
    console.log(value);
  },
  ...controllerProps
}: ListBoxProps) => {
  const [selected, setSelected] = useState(defaultOption || options[0]);
  const { field: { onChange: onControllerChange }, formState: { defaultValues } } = useController({
    ...controllerProps,
    defaultValue: selected,
  });

  // When calling reset, should change selected value
  const { name } = controllerProps;

  useEffect(() => {
    if (defaultValues) {
      setSelected(defaultValues[name] || options[0]);
    }
  }, [defaultValues, setSelected, name, options]);

  return (
    <div className="top-16 w-72">
      <Listbox
        value={selected}
        onChange={(value) => {
          setSelected(value as ListBoxOption);
          onControllerChange(value);
          onChange(value as ListBoxOption);
        }}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selected}</span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute mt-1 z-20 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((option, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                  }`}
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                    >
                      {option}
                    </span>
                    {selected
                      ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className={tw("h-5 w-5")} aria-hidden="true" />
                        </span>
                      )
                      : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};
