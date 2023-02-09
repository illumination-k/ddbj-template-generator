import { apply, tw } from "@twind/core";

import React, { Dispatch, SetStateAction } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/client/components/Button";
import { Chip } from "@/client/components/Chip";

import PreviewTable from "@/client/components/PreviewTable";

import FieldForm from "@/client/components/FieldForm";
import PreviewTsv from "@/client/components/PreviewTsv";
import createCtx from "@/client/libs/createCtx";
import isDepend from "@/client/libs/isDepend";
import { attachReplicateToSamplename, attachReplicateToSampleTitle } from "@/client/libs/replicates";
import { attachAstarisks } from "@/client/libs/tsvHeader";
import { Field } from "@/client/types/field";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

type BiosampleValueScalar = string | number | undefined;

type BiosampleValue =
  | BiosampleValueScalar
  | { value: string }[]
  | { [key: string]: BiosampleValueScalar }[];

export type BiosampleData = { [key: string]: BiosampleValue };

function biosampleValueScalerToString(val: BiosampleValueScalar): string {
  if (!val) {
    return "";
  } else if (typeof val === "string") {
    return val;
  } else if (typeof val === "number") {
    if (isNaN(val)) {
      return "";
    }

    return val.toString();
  } else {
    throw "Unreacheable";
  }
}

// Fieldのtransformsを再帰的に適用する
// 循環参照にならないように注意
// 最高再帰回数は5
function recursiveTransform(data: BiosampleData, curField: Field, allFields: Field[], depth: number = 0): string {
  const self = biosampleValueToString(data[curField.name]);
  if (!curField.transforms) {
    return self;
  }

  if (depth > 5) {
    return self;
  }

  return curField.transforms.reduce((p, t) => {
    const { depend, dependValue, dependType } = t.depend_def;
    if (!isDepend(data[depend], dependValue, dependType)) {
      return p;
    }

    return t.replace_names.reduce((p, name) => {
      const findex = allFields.map((f) => f.name).indexOf(name);
      if (findex === -1) {
        return p;
      }

      const f = allFields[findex];

      if (!f.transforms) {
        const value = biosampleValueToString(data[name]);
        return p.replace(`#${name}`, value);
      }

      return p.replace(`#${name}`, recursiveTransform(data, f, allFields, depth + 1));
    }, t.template.replace("#self", self));
  }, self);
}

function biosampleValueToString(val: BiosampleValue): string {
  if (!val) {
    return "";
  } else if (typeof val === "string") {
    return val;
  } else if (typeof val === "number") {
    if (isNaN(val)) {
      return "";
    }

    return val.toString();
  } else {
    if (val.length === 0) {
      return "";
    }

    if (Object.keys(val[0]).length === 1 && Object.keys(val[0]).includes("value")) {
      return val.filter((v) => v.value !== "").map((v) => v.value).join(",");
    } else {
      return val.map((v) =>
        Object.entries(v).map(([key, value]) => {
          return `${key}:${biosampleValueScalerToString(value)}`;
        })
      ).join(";");
    }
  }
}

function generateDDBJTemplateTsv(
  data: BiosampleData[],
  fields: Field[],
  fixedData: { [key: string]: string },
  sep = "\t",
) {
  // headerの最初がsample_nameである必要がある
  const header: string[] = (fields.map((f) => attachAstarisks(f.name))).concat(Object.keys(fixedData));
  // 最終行にreplicateの情報を加える
  // https://www.ddbj.nig.ac.jp/biosample/validation.html#BS_R0024
  header.push("replicate");

  const fixedBodyData = Object.values(fixedData);

  let body: string[][] = [];

  data.forEach((d) => {
    // Number of duplicatesの数だけエレメントを作成
    const replicates_number = d["replicates_number"] as number;

    for (let i = 0; i < replicates_number; i++) {
      let elems: string[] = [];
      fields.forEach((f) => {
        const val = biosampleValueToString(d[f.name]);

        // sample nameとsample titleにreplicate情報の追加
        if (f.name === "sample_name") {
          elems.push(attachReplicateToSamplename(val, i + 1));
          return;
        } else if (f.name === "sample_title") {
          elems.push(attachReplicateToSampleTitle(val, i + 1));
          return;
        }

        // processing transform definition
        // ある値の時に他のデータを参照しながら値を変更できる
        if (f.transforms && f.transforms.length !== 0) {
          const e = recursiveTransform(d, f, fields);
          elems.push(e);

          return;
        }

        elems.push(val);
      });

      body.push(
        elems
          .concat(fixedBodyData)
          .concat([`biological replicate ${i + 1}`]),
      );
    }
  });

  let emptyFlags: boolean[] = [];

  if (body.length === 0) {
    return [header.join(sep)];
  }

  for (let x = 0; x < body[0].length; x++) {
    let ok = false;
    for (let y = 0; y < body.length; y++) {
      if (body[y][x] !== "") {
        ok = true;
      }
    }
    emptyFlags.push(ok);
  }

  return [header.filter((_, i) => emptyFlags[i]).join(sep)].concat(
    body.map((b) => b.filter((_, i) => emptyFlags[i]).join(sep)),
  );
}

export type BiosampleCurrentData = { index: number; data: BiosampleData } | undefined;

type BiosampleFormContextType = {
  organism: string;
  taxonomy_id: string;
  bioproject_id: string;
  fields: Field[];
  curData: BiosampleCurrentData;
  setCurData: Dispatch<SetStateAction<BiosampleCurrentData>>;
  data: BiosampleData[];
  setData: Dispatch<SetStateAction<BiosampleData[]>>;
};

const [useBiosampleFormContextInner, BiosampleFormContextProvider] = createCtx<BiosampleFormContextType>();

function useBiosampleFormContext() {
  const { fields, curData, ...rest } = useBiosampleFormContextInner();

  let defaultValues: BiosampleData = {};
  fields.forEach((f) => {
    if (f.type === "nestedarray") {
      return;
    }

    defaultValues[f.name] = f.defaultValue;
  });

  return {
    fields,
    curData,
    defaultValues,
    ...rest,
  };
}

export { BiosampleFormContextProvider };

const BiosampleForm = ({}) => {
  const { bioproject_id, organism, defaultValues, taxonomy_id, fields, curData, setCurData, data, setData } =
    useBiosampleFormContext();

  const method = useForm<BiosampleData>({ shouldUnregister: true, defaultValues });

  // const organism = "Marchantia polymorpha subsp. ruderalis";
  // const taxonomy_id = "1480154";

  const onSubmit = (formData: BiosampleData) => {
    // need validation here
    // 1. combination requirement
    // 2. unique sample_name and sample_title
    if (curData) {
      data[curData.index] = formData;
      setData([...data]);
    } else {
      setData([...data, formData]);
    }

    setCurData(undefined);
    method.reset(defaultValues);
  };

  return (
    <div className="grid grid-cols-1 place-items-center">
      <h1 className={tw("text-blue-500 pt-5 pb-8 text-center text-5xl")}>Biosample Form</h1>

      <div className={tw("grid grid-cols-2 gap-10 px-10")}>
        <FormProvider {...method}>
          {/* Form */}
          <form onSubmit={method.handleSubmit(onSubmit)}>
            {fields.map((f, i) => <FieldForm field={f} key={i} />)}
            <div className="flex justify-end">
              <Button type="submit">Save Sample Information</Button>
            </div>
          </form>

          {/* PreviewColumn */}
          <div>
            <div className="sticky top-10">
              {/* PreviewTable */}
              <PreviewTable
                organism={organism}
                taxonomy_id={taxonomy_id}
                bioproject_id={bioproject_id}
                fields={fields}
              />

              {/* Saved Items */}
              <div className="min-h-[11rem] bg-gray-100 rounded-lg my-5">
                {data.length === 0
                  ? (
                    <p className="px-3 py-3 text-2xl font-semibold">
                      No sample is saved
                    </p>
                  )
                  : ""}
                <div className="flex flex-wrap gap-3 px-2 py-3">
                  {data.map((d, i) => {
                    const isSelected = curData && curData.index === i;
                    return (
                      <Chip
                        className={tw(apply("flex items-center", isSelected ? "bg-blue-100" : ""))}
                        key={i}
                      >
                        <p className="pr-3 font-bold text-xl">
                          {`${d["sample_title"] as string} (${d["replicates_number"] as number})`}
                        </p>

                        {/* Edit button */}
                        <button
                          onClick={() => {
                            method.reset(d);
                            setCurData({ index: i, data: { ...data[i] } });
                          }}
                        >
                          <PencilSquareIcon className="h-6 w-6" />
                        </button>

                        {/* delete button */}
                        <button
                          onClick={() => {
                            method.reset(defaultValues);
                            setCurData(undefined);
                            data.splice(i, 1);
                            setData([...data]);
                          }}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </Chip>
                    );
                  })}
                </div>
              </div>

              {/* Generation Button Items */}
              <div className="flex justify-end">
                <PreviewTsv
                  bioproject_id={bioproject_id}
                  tsvGenerator={() => {
                    const lines = generateDDBJTemplateTsv(
                      data,
                      fields,
                      {
                        bioproject_id,
                        organism,
                        sub_species: "ruderalis",
                        taxonomy_id,
                        geo_loc_name: "not applicable",
                      },
                    );

                    return lines.join("\n");
                  }}
                />
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default BiosampleForm;
