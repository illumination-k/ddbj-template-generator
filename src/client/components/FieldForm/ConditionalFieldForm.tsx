import isDepend from "@/client/libs/isDepend";
import { ConditionalField } from "@/client/types/field";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FieldFormBase from "./FieldFormBase";

type ConditionalFieldFormProps = {
  field: ConditionalField;
};

const ConditionalFieldForm = ({ field }: ConditionalFieldFormProps) => {
  const { watch } = useFormContext();
  const { depend, dependType, dependValue, ...fieldBase } = field;

  const val = watch(depend);

  return (
    <>
      {isDepend(val, dependValue, dependType) ? <FieldFormBase field={fieldBase} /> : null}
    </>
  );
};

export default ConditionalFieldForm;
