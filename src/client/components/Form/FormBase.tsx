import React from "react";
import { useFormContext } from "react-hook-form";

import { ListBox } from "./Listbox";

import Input from "./Input";
import LabelWithHelp from "./LabelWithHelp";

import { UnconditionalFormSchema } from "@/schema/FormSchema";
import ErrorMessage from "./ErrorMessage";
import NestedArrayInput from "./NestedArrayInput";
import TextForm from "./TextForm";

type FieldFormProps = {
  formSchema: UnconditionalFormSchema;
};

const FieldFormBase = ({ formSchema }: FieldFormProps) => {
  const { register, control } = useFormContext();

  switch (formSchema.type) {
    case "input": {
      const { isNumber } = formSchema;

      if (formSchema.isNumber) {
        const { name, label, required, help, comment, isNumber, min, max, defaultValue } = formSchema;
        return (
          <LabelWithHelp label={label} help={help} required={required} comment={comment}>
            <Input
              id={name}
              type={isNumber ? "number" : undefined}
              defaultValue={defaultValue}
              {...register(name, { required, valueAsNumber: isNumber, min, max })}
            />
            <ErrorMessage formSchema={formSchema} />
          </LabelWithHelp>
        );
      } else {
        const { name, label, required, help, comment, pattern, defaultValue, placeholder } = formSchema;
        return (
          <LabelWithHelp label={label} help={help} required={required} comment={comment}>
            <Input
              id={name}
              type={isNumber ? "number" : undefined}
              placeholder={placeholder}
              defaultValue={defaultValue}
              {...register(name, { required, valueAsNumber: isNumber, pattern })}
            />
            <ErrorMessage formSchema={formSchema} />
          </LabelWithHelp>
        );
      }
    }

    case "text": {
      return <TextForm formSchema={formSchema} />;
    }

    case "select": {
      const { label, name, help, required, options, defaultValue } = formSchema;
      if (!options || options.length === 0) {
        throw new Error("Option must be array whose length is greater than 1");
      }

      return (
        <LabelWithHelp label={label} help={help} required={required}>
          <ListBox options={options} name={name} defaultValue={defaultValue} rules={{ required }} {...control} />
          <ErrorMessage formSchema={formSchema} />
        </LabelWithHelp>
      );
    }

    case "nestedarray": {
      return <NestedArrayInput formSchema={formSchema} />;
    }

    case "radio": {
      const { label, name, help, required, options } = formSchema;
      if (!options || options.length === 0) {
        throw new Error("Option must be array whose length is greater than 1");
      }

      return (
        <LabelWithHelp label={label} help={help} required={required}>
          <div className="flex gap-3">
            {options.map((option, i) => (
              <div key={i} className="flex items-center gap-1">
                <input type="radio" value={option} {...register(name, { required })} />
                <label>{option}</label>
              </div>
            ))}
          </div>
          <ErrorMessage formSchema={formSchema} />
        </LabelWithHelp>
      );
    }

    default:
      throw new Error(`Invalid Field: ${formSchema}`);
  }
};

export default FieldFormBase;
