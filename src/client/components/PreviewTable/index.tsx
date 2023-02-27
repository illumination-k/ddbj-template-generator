import isDepend from "@/client/libs/isDepend";
import { FormSchema } from "@/schema/FormSchema";
import React from "react";
import { useFormContext } from "react-hook-form";

type PreviewTableCellProps = {
  formSchema: FormSchema;
};

type PreviewTableCellInnerProps = {
  val: any;
  formSchema: FormSchema;
};

const Td = ({ children }: React.PropsWithChildren) => {
  return (
    <td className="px-2 w-96">
      {children}
    </td>
  );
};

const PreviewTableCellInner = ({ val, formSchema }: PreviewTableCellInnerProps) => {
  if (formSchema.type === "nestedarray") {
    return (
      <tr>
        <Td>{formSchema.label}</Td>
        <Td>
          {val
            ? val.map((v: { [key: string]: string | number | undefined }, i: number) => {
              const displayValue = formSchema.schemas.map((schema) => {
                if (val) {
                  return `${schema.label}: ${v[schema.name]}`;
                } else {
                  return `${schema.label}: ${schema.defaultValue}`;
                }
              }).join("; ");

              return <p key={i}>{displayValue}</p>;
            })
            : ""}
        </Td>
      </tr>
    );
  }

  return (
    <tr>
      <Td>{formSchema.label}</Td>
      <Td>{val}</Td>
    </tr>
  );
};

const PreviewTableCell = ({ formSchema }: PreviewTableCellProps) => {
  const { watch } = useFormContext();
  const val = watch(formSchema.name);

  if ("dependDef" in formSchema) {
    const { depend, dependValue, dependType } = formSchema.dependDef;
    const dependVal = watch(depend);

    return (
      <>
        {isDepend(dependVal, dependValue, dependType)
          ? <PreviewTableCellInner val={val} formSchema={formSchema} />
          : null}
      </>
    );
  } else {
    return <PreviewTableCellInner val={val} formSchema={formSchema} />;
  }
};

export type PreviewTableProps = {
  organism: string;
  taxonomy_id: string;
  bioproject_id: string;
  formSchemas: FormSchema[];
};

const PreviewTable = ({ bioproject_id, organism, taxonomy_id, formSchemas }: PreviewTableProps) => {
  return (
    <table className="table-fixed">
      <thead className="text-xl text-gray-700 bg-gray-50">
        <tr>
          <th className="w96">Attribute Name</th>
          <th className="w-96">Attribute Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <Td>Organism</Td>
          <Td>{organism}</Td>
        </tr>
        <tr>
          <Td>Taxonomy ID</Td>
          <Td>{taxonomy_id}</Td>
        </tr>
        <tr>
          <Td>Bioproject ID</Td>
          <Td>{bioproject_id}</Td>
        </tr>
        {formSchemas.map((f, i) => <PreviewTableCell formSchema={f} key={i} />)}
      </tbody>
    </table>
  );
};

export default PreviewTable;
