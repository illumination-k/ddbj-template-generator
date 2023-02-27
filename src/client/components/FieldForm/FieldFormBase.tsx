import React from "react";
import { useFormContext } from "react-hook-form";

import { ListBox } from "./Listbox";

import Input from "./Input";
import LabelWithHelp from "./LabelWithHelp";

import { UnconditionalField } from "@/client/types/field";
import ArrayInput from "./ArrayInput";
import ErrorMessage from "./ErrorMessage";
import NestedArrayInput from "./NestedArrayInput";
import TextForm from "./TextForm";

type FieldFormProps = {
  field: UnconditionalField;
};

const FieldFormBase = ({ field }: FieldFormProps) => {
  const { register, control } = useFormContext();

  switch (field.type) {
    case "input": {
      const { isNumber } = field;

      if (field.isNumber) {
        const { name, label, required, help, comment, isNumber, min, max, defaultValue } = field;
        return (
          <LabelWithHelp label={label} help={help} required={required} comment={comment}>
            <Input
              id={name}
              type={isNumber ? "number" : undefined}
              {...register(name, { required, valueAsNumber: isNumber, min, max })}
            />
            <ErrorMessage field={field} />
          </LabelWithHelp>
        );
      } else {
        const { name, label, required, help, comment, pattern, defaultValue } = field;
        return (
          <LabelWithHelp label={label} help={help} required={required} comment={comment}>
            <Input
              id={name}
              type={isNumber ? "number" : undefined}
              {...register(name, { required, valueAsNumber: isNumber, pattern })}
            />
            <ErrorMessage field={field} />
          </LabelWithHelp>
        );
      }
    }

    case "text": {
      return <TextForm field={field} />;
    }

    case "select": {
      const { label, name, help, required, options, defaultValue } = field;
      if (!options || options.length === 0) {
        throw new Error("Option must be array whose length is greater than 1");
      }

      return (
        <LabelWithHelp label={label} help={help} required={required}>
          <ListBox options={options} name={name} defaultValue={defaultValue} rules={{ required }} {...control} />
          <ErrorMessage field={field} />
        </LabelWithHelp>
      );
    }

    case "arrayinput": {
      return <ArrayInput field={field} />;
    }

    case "nestedarray": {
      return <NestedArrayInput field={field} />;
    }

    case "radio": {
      const { label, name, help, required, options } = field;
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
          <ErrorMessage field={field} />
        </LabelWithHelp>
      );
    }

    default:
      throw new Error(`Invalid Field: ${field}`);
  }
};

export default FieldFormBase;
