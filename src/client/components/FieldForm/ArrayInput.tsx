import { ArrayInputField } from "@/client/types/field";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Input from "./Input";
import LabelWithHelp from "./LabelWithHelp";

type ArrayInputProps = {
  field: ArrayInputField;
};

const ArrayInput = ({ field }: ArrayInputProps) => {
  const { name, help, required, label, pattern } = field;
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name, shouldUnregister: true });

  return (
    <LabelWithHelp label={label} required={required} help={help}>
      {fields.map((f, i) => {
        return <Input key={f.id} {...register(`${name}.${i}.value` as const, { required, pattern })} />;
      })}
      <div className="flex justify-end">
        <button onClick={() => append({ value: "" })}>
          <PlusCircleIcon className="h-10 w-10" />
        </button>
        <button onClick={() => remove(-1)}>
          <MinusCircleIcon className="h-10 w-10" />
        </button>
      </div>
    </LabelWithHelp>
  );
};

export default ArrayInput;
