import React from "react";

import { Field } from "@/client/types/field";
import ConditionalFieldForm from "./ConditionalFieldForm";
import FieldFormBase from "./FieldFormBase";

type FieldFormProps = {
  field: Field;
};

const FieldForm = ({ field }: FieldFormProps) => {
  if ("depend" in field) {
    return <ConditionalFieldForm field={field} />;
  } else {
    return <FieldFormBase field={field} />;
  }
};

export default FieldForm;
