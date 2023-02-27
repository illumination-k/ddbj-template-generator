import isDepend from "@/client/libs/isDepend";
import { ConditionalFormSchema } from "@/schema/FormSchema";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import FieldFormBase from "./FormBase";

type ConditionalFieldFormProps = {
  formSchema: ConditionalFormSchema;
};

const ConditionalForm = ({ formSchema }: ConditionalFieldFormProps) => {
  const { watch } = useFormContext();
  const { dependDef, ...fieldBase } = formSchema;
  const { depend, dependType, dependValue } = dependDef;

  const val = watch(depend);

  return (
    <>
      {isDepend(val, dependValue, dependType)
        ? (
          <div className="ml-5">
            <FieldFormBase formSchema={fieldBase} />
          </div>
        )
        : null}
    </>
  );
};

export default ConditionalForm;
