import { Menu } from "@headlessui/react";

import { TextExample, TextFormSchema } from "@/schema/FormSchema";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { apply, tw } from "@twind/core";
import { useFormContext } from "react-hook-form";
import { Button } from "../Button";
import ErrorMessage from "./ErrorMessage";
import HelpPopover from "./HelpPopover";
import Textarea from "./Textarea";

type TextFormProps = { formSchema: TextFormSchema };

type ExampleProps = {
  name: string;
  example?: TextExample;
};

function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Example = ({ name, example }: ExampleProps) => {
  const { setValue } = useFormContext();
  if (!example) {
    return <></>;
  }

  if (typeof example === "string") {
    return (
      <Button onClick={() => setValue(name, example)}>
        Example
      </Button>
    );
  }

  return (
    <Menu as="div" className="relative my-1">
      <div>
        <Menu.Button
          className={tw(apply(
            "inline-flex w-full justify-center z-10",
            "rounded-md bg-blue-800",
            "px-3 py-1 text-sm font-medium text-white",
            "hover:bg-opacity-70",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
          ))}
        >
          Examples
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100" aria-hidden="true" />
        </Menu.Button>
      </div>
      <div>
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {example.map((e, i) => (
            <Menu.Item key={i}>
              {({ active }) => (
                <button
                  className={tw(
                    apply(
                      active ? "bg-blue-500 text-white" : "text-gray-900",
                      "w-full text-center rounded-md px-2 py-2 text-sm",
                    ),
                  )}
                  onClick={() => setValue(name, e.content)}
                >
                  {capitalize(e.name)}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </div>
    </Menu>
  );
};

const TextForm = ({ formSchema }: TextFormProps) => {
  const { register } = useFormContext();
  const { name, label, help, defaultValue, required, comment, example } = formSchema;

  return (
    <div className="my-2">
      <div className="flex justify-between items-center">
        <label className="flex">
          {required ? <p className={"text-red-600"}>*</p> : <></>}
          <p className="px-1">{label}</p>
          {comment ? <p>({comment})</p> : <></>}
        </label>
        <div className="flex items-center gap-2">
          <Example name={name} example={example} />
          {help
            ? <HelpPopover help={help} />
            : <></>}
        </div>
      </div>
      <Textarea className="h-24" defaultValue={defaultValue} id={name} {...register(name, { required })} />
      <ErrorMessage formSchema={formSchema} />
    </div>
  );
};

export default TextForm;
