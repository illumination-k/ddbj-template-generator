import { apply, tw } from "@twind/core";

import React, { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/client/components/Button";
import { Chip } from "@/client/components/Chip";

import PreviewTable from "@/client/components/PreviewTable";

import FieldForm from "@/client/components/FieldForm";
import PreviewTsv from "@/client/components/PreviewTsv";
import createCtx from "@/client/libs/createCtx";

import { Field } from "@/client/types/field";
import { ArrowPathIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { generateDDBJTemplateTsv } from "./generateTemplate";
import { BiosampleData } from "./types";
import { validateData } from "./validation";

export type { BiosampleData };
export type BiosampleCurrentData = { index: number; data: BiosampleData } | undefined;

type BiosampleFormContextType = {
  organism: string;
  sub_species?: string;
  taxonomy_id: string;
  bioproject_id: string;
  fields: Field[];
  curData: BiosampleCurrentData;
  fixedData?: { [key: string]: string };
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

    defaultValues[f.name] = f.defaultValue || "";
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
  const {
    bioproject_id,
    organism,
    sub_species,
    fixedData,
    defaultValues,
    taxonomy_id,
    fields,
    curData,
    setCurData,
    data,
    setData,
  } = useBiosampleFormContext();

  const method = useForm<BiosampleData>({ shouldUnregister: true, defaultValues });
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const onSubmit = (formData: BiosampleData) => {
    // need validation here
    // 1. combination requirement
    // 2. unique sample_name and sample_title
    setErrorMessages([]);
    const errors = validateData(
      formData,
      curData ? data.filter((_, i) => i !== curData.index) : data,
      fixedData,
    );

    if (errors.length != 0) {
      setErrorMessages(errors);
      return;
    }

    if (curData) {
      data[curData.index] = formData;
      setData([...data]);
    } else {
      setData([...data, formData]);
    }

    setCurData(undefined);

    // only reset sample name and sample title
    // because similar sample is often submitted
    method.reset({ ...formData, ...{ sample_name: "", sample_title: "" } });
  };

  return (
    <div className="grid grid-cols-1 place-items-center">
      <h1 className={tw("text-blue-500 pt-5 pb-8 text-center text-5xl")}>Biosample Form</h1>

      <div className={tw("grid grid-cols-2 gap-10 px-10")}>
        <FormProvider {...method}>
          {/* Form */}
          <form onSubmit={method.handleSubmit(onSubmit)}>
            {fields.map((f, i) => <FieldForm field={f} key={i} />)}

            {errorMessages.length !== 0
              ? <>{errorMessages.map((m, i) => <p key={i} className="text-red-500">{m}</p>)}</>
              : <></>}

            <div className="flex justify-end gap-3 pt-2 pb-7">
              <Button type="button" className="flex gap-2 items-center" onClick={() => method.reset(defaultValues)}>
                <ArrowPathIcon className="h-5 w-5" />
                <p>Reset Form</p>
              </Button>
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
                        sub_species,
                        taxonomy_id,
                        generated_by: "biosample_generator",
                        ...fixedData,
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
