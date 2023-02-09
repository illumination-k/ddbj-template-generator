import { Field } from "@/client/types/field";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

type ErrorMessageProps = {
  field: Field;
};

const ErrorMessageP = ({ children }: React.PropsWithChildren) => {
  return <p className="text-red-500">{children}</p>;
};

const ErrorMessage = ({ field }: ErrorMessageProps) => {
  const { watch, formState: { errors } } = useFormContext();

  const val = watch(field.name);

  if (errors[field.name]) {
    if (field.required && !val) {
      return <ErrorMessageP>{field.label} is required</ErrorMessageP>;
    }

    if (field.errorTemplate) {
      return <ErrorMessageP>{field.errorTemplate.replace("#label", field.label)}</ErrorMessageP>;
    } else {
      return <ErrorMessageP>Value of {field.label} is invalid</ErrorMessageP>;
    }
  }

  return <></>;
};

export default ErrorMessage;
