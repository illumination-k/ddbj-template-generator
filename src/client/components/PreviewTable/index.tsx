import isDepend from "@/client/libs/isDepend";
import { Field } from "@/client/types/field";
import React from "react";
import { useFormContext } from "react-hook-form";

type PreviewTableCellProps = {
  field: Field;
};

type PreviewTableCellInnerProps = {
  val: any;
  field: Field;
};

const Td = ({ children }: React.PropsWithChildren) => {
  return (
    <td className="px-2 w-96">
      {children}
    </td>
  );
};

const PreviewTableCellInner = ({ val, field }: PreviewTableCellInnerProps) => {
  if (field.type === "arrayinput") {
    return (
      <tr>
        <Td>{field.label}</Td>
        <Td>
          {val?.filter((v: { value: string }) => v.value !== "").map((v: { value: string }) => v.value).join(", ")}
        </Td>
      </tr>
    );
  }

  return (
    <tr>
      <Td>{field.label}</Td>
      <Td>{val}</Td>
    </tr>
  );
};

const PreviewTableCell = ({ field }: PreviewTableCellProps) => {
  const { watch } = useFormContext();
  const val = watch(field.name);

  if ("depend" in field) {
    const dependVal = watch(field.depend);
    const { dependValue, dependType } = field;
    return (
      <>
        {isDepend(dependVal, dependValue, dependType)
          ? <PreviewTableCellInner val={val} field={field} />
          : null}
      </>
    );
  } else {
    return <PreviewTableCellInner val={val} field={field} />;
  }
};

export type PreviewTableProps = {
  organism: string;
  taxonomy_id: string;
  bioproject_id: string;
  fields: Field[];
};

const PreviewTable = ({ bioproject_id, organism, taxonomy_id, fields }: PreviewTableProps) => {
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
        {fields.map((f, i) => <PreviewTableCell field={f} key={i} />)}
      </tbody>
    </table>
  );
};

export default PreviewTable;
