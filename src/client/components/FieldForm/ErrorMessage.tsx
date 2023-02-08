import { Field } from "@/client/types/field";
import React from "react";
import { useFormContext } from "react-hook-form";

type ErrorMessageProps = {
  field: Field;
};

const ErrorMessageP = ({ children }: React.PropsWithChildren) => {
  return <p className="text-red-500">{children}</p>;
};

const ErrorMessage = ({ field }: ErrorMessageProps) => {
  const { formState: { errors } } = useFormContext();

  if (errors[field.name]) {
    if (field.errorTemplate) {
      return <ErrorMessageP>{field.errorTemplate}</ErrorMessageP>;
    }

    if (field.required) {
      return <ErrorMessageP>{field.label} is required</ErrorMessageP>;
    }
  }

  return <></>;
};

export default ErrorMessage;
