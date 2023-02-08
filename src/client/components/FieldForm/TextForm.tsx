import { TextField } from "@/client/types/field";
import { useFormContext } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";
import HelpPopover from "./HelpPopover";
import Textarea from "./Textarea";

type TextFormProps = { field: TextField };

const TextForm = ({ field }: TextFormProps) => {
  const { register, setValue } = useFormContext();
  const { name, label, help, required, comment, example } = field;

  return (
    <div className="my-2">
      <div className="flex justify-between items-center">
        <label className="flex">
          {required ? <p className={"text-red-600"}>*</p> : <></>}
          <p className="px-1">{label}</p>
          {comment ? <p>({comment})</p> : <></>}
        </label>
        <div className="flex">
          {example
            ? (
              <button
                className="rounded-lg bg-blue-300 px-2 py-1 mb-1"
                onClick={() => {
                  setValue(name, example);
                }}
              >
                Example
              </button>
            )
            : null}
          {help
            ? <HelpPopover help={help} />
            : <></>}
        </div>
      </div>
      <Textarea className="h-24" id={name} {...register(name, { required })} />
      <ErrorMessage field={field} />
    </div>
  );
};

export default TextForm;
