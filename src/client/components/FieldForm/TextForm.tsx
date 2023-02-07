import { TextField } from "@/client/types/field";
import { useFormContext } from "react-hook-form";
import HelpPopover from "./HelpPopover";
import Textarea from "./Textarea";

type TextFormProps = { field: TextField };

const TextForm = ({ field }: TextFormProps) => {
  const { register, reset } = useFormContext();
  const { name, label, help, required, comment } = field;

  return (
    <div className="my-2">
      <div className="flex justify-between">
        <label className="flex">
          {required ? <p className={"text-red-600"}>*</p> : <></>}
          <p className="px-1">{label}</p>
          {comment ? <p>({comment})</p> : <></>}
        </label>

        {help
          ? <HelpPopover help={help} />
          : <></>}
      </div>
      <Textarea className="h-24" id={name} {...register(name, { required })} />
    </div>
  );
};

export default TextForm;
