import { FormSchema } from "@/schema/FormSchema";
import React from "react";
import { useFormContext } from "react-hook-form";

type ErrorMessageProps = {
  formSchema: FormSchema;
};

const ErrorMessageP = ({ children }: React.PropsWithChildren) => {
  return <p className="text-red-500">{children}</p>;
};

const ErrorMessage = ({ formSchema }: ErrorMessageProps) => {
  const { watch, formState: { errors } } = useFormContext();

  const val = watch(formSchema.name);

  if (errors[formSchema.name]) {
    if (formSchema.required && !val) {
      return <ErrorMessageP>{formSchema.label} is required</ErrorMessageP>;
    }

    if (formSchema.errorTemplate) {
      return <ErrorMessageP>{formSchema.errorTemplate.replace("#label", formSchema.label)}</ErrorMessageP>;
    } else {
      return <ErrorMessageP>Value of {formSchema.label} is invalid</ErrorMessageP>;
    }
  }

  return <></>;
};

export default ErrorMessage;
