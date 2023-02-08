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
      {isDepend(val, dependValue, dependType)
        ? (
          <div className="ml-5">
            <FieldFormBase field={fieldBase} />
          </div>
        )
        : null}
    </>
  );
};

export default ConditionalFieldForm;
