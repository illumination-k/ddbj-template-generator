import React from "react";

import { FormSchema } from "@/schema/FormSchema";
import ConditionalForm from "./ConditionalForm";
import FieldFormBase from "./FormBase";

type FieldFormProps = {
  formSchema: FormSchema;
};

const FieldForm = ({ formSchema }: FieldFormProps) => {
  if ("dependDef" in formSchema) {
    return <ConditionalForm formSchema={formSchema} />;
  } else {
    return <FieldFormBase formSchema={formSchema} />;
  }
};

export default FieldForm;
