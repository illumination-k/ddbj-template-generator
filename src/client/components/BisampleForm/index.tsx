import { apply, tw } from "@twind/core";

import React, { Dispatch, SetStateAction } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/client/components/Button";
import { Chip } from "@/client/components/Chip";

import PreviewTable from "@/client/components/PreviewTable";

import createCtx from "@/client/libs/createCtx";
import { attachReplicateToSamplename, attachReplicateToSampleTitle } from "@/client/libs/replicates";
import { Field } from "@/client/types/field";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import FieldForm from "../FieldForm";

type BiosampleValue = string | number | { value: string }[] | undefined;
export type BiosampleData = { [key: string]: BiosampleValue };

function biosampleValueToString(val: BiosampleValue) {
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
    return val.filter((v) => v.value !== "").map((v) => v.value).join(",");
  }
}

function generateTemplateTsv(
  data: BiosampleData[],
  fields: Field[],
  fixedData: { organism: string; bioproject_id: string; taxonomy_id: string },
) {
  const sep = ",";

  const header: string[] = Object.keys(fixedData).concat(fields.map((f) => f.name));

  const fixedBodyData = Object.values(fixedData);

  let body: string[][] = [];

  data.forEach((d) => {
    // Number of duplicatesの数だけエレメントを作成
    const number_of_biological_duplicates = d["number_of_biological_duplicates"] as number;

    for (let i = 0; i < number_of_biological_duplicates; i++) {
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

        elems.push(val);
      });

      body.push(fixedBodyData.concat(elems));
    }
  });

  let emptyFlags: boolean[] = [];
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
    defaultValues[f.name] = f.defaultValue;
  });

  console.log("CreatedDefaultValues:", defaultValues);

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
              <Button type="submit">{curData ? "Save" : "Submit"} Sample Information</Button>
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
              <div className="flex flex-wrap gap-3 py-5">
                {data.map((d, i) => {
                  const isSelected = curData && curData.index === i;
                  return (
                    <Chip
                      className={tw(apply("flex items-center", isSelected ? "bg-blue-100" : ""))}
                      key={i}
                    >
                      <p className="pr-3 font-bold text-xl">
                        {`${d.sample_title as string} (${d.number_of_biological_duplicates as number})`}
                      </p>
                      <button
                        onClick={() => {
                          method.reset(d);
                          setCurData({ index: i, data: { ...data[i] } });
                        }}
                      >
                        <PencilSquareIcon className="h-6 w-6" />
                      </button>

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

              {/* Generation Button Items */}
              <div className="flex">
                <Button
                  onClick={() => {
                    const lines = generateTemplateTsv(
                      data,
                      fields,
                      {
                        bioproject_id,
                        organism,
                        taxonomy_id,
                      },
                    );

                    const file = new Blob([lines.join("\n")], { type: "text/plain" });
                    const element = document.createElement("a");
                    element.href = URL.createObjectURL(file);
                    element.download = `${bioproject_id}.tsv`;

                    document.body.appendChild(element);
                    element.click();
                  }}
                >
                  Generate Template
                </Button>
              </div>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
};

export default BiosampleForm;
