import { NestedArrayInputFormSchema, NestedArraySchema } from "@/schema/FormSchema";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import Input from "./Input";
import LabelWithHelp from "./LabelWithHelp";
import { ListBox } from "./Listbox";

export type NestedArrayInputProps = {
  formSchema: NestedArrayInputFormSchema;
};

function createDefaultValue(schema: NestedArraySchema[]) {
  return schema.reduce((p, c) => {
    const { name, defaultValue } = c;
    p[name] = defaultValue;
    return p;
  }, {} as { [key: string]: string | number | undefined });
}

const NestedArrayInput = ({ formSchema }: NestedArrayInputProps) => {
  const { name, help, required, label } = formSchema;
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name, shouldUnregister: true });

  return (
    <LabelWithHelp label={label} required={required} help={help}>
      {fields.map((f, i) => {
        return (
          <Fragment key={i}>
            {formSchema.schemas.map((schema) => {
              switch (schema.type) {
                case "input": {
                  return (
                    <LabelWithHelp label={schema.label} required={schema.required}>
                      <Input
                        key={f.id}
                        {...register(`${name}.${i}.${schema.name}` as const, { required: schema.required })}
                      />
                    </LabelWithHelp>
                  );
                }
                case "select": {
                  return (
                    <LabelWithHelp label={schema.label}>
                      <ListBox key={f.id} name={`${name}.${i}.${schema.name}` as const} options={schema.options} />
                    </LabelWithHelp>
                  );
                }
              }
            })}
          </Fragment>
        );
      })}
      <div className="flex justify-end">
        <button type="button" onClick={() => append(createDefaultValue(formSchema.schemas))}>
          <PlusCircleIcon className="h-8 w-8" />
        </button>
        <button type="button" onClick={() => remove(-1)}>
          <MinusCircleIcon className="h-8 w-8" />
        </button>
      </div>
    </LabelWithHelp>
  );
};

export default NestedArrayInput;
