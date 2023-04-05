import { apply, tw } from "@twind/core";

import React, { Dispatch, SetStateAction, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/client/components/Button";
import { Chip } from "@/client/components/Chip";

import PreviewTable from "@/client/components/PreviewTable";

import FieldForm from "@/client/components/Form";
import PreviewTsv from "@/client/components/PreviewTsv";
import createCtx from "@/client/libs/createCtx";

import { FormSchema } from "@/schema/FormSchema";
import { ArrowPathIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { biological_replicates_number_name } from "@/schema/biosample/base";
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
  formSchemas: FormSchema[];
  curData: BiosampleCurrentData;
  fixedData?: { [key: string]: string };
  setCurData: Dispatch<SetStateAction<BiosampleCurrentData>>;
  data: BiosampleData[];
  setData: Dispatch<SetStateAction<BiosampleData[]>>;
};

const [useBiosampleFormContextInner, BiosampleFormContextProvider] = createCtx<BiosampleFormContextType>();

function useBiosampleFormContext() {
  const { formSchemas, curData, ...rest } = useBiosampleFormContextInner();

  let defaultValues: BiosampleData = {};
  formSchemas.forEach((f) => {
    if (f.type === "nestedarray") {
      return;
    }

    defaultValues[f.name] = f.defaultValue || "";
  });

  return {
    formSchemas,
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
    formSchemas,
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
      <div className={tw("grid grid-cols-2 gap-10 px-10")}>
        <FormProvider {...method}>
          {/* Form */}
          <form onSubmit={method.handleSubmit(onSubmit)}>
            {formSchemas.map((f, i) => <FieldForm formSchema={f} key={i} />)}

            {errorMessages.length !== 0
              ? <>{errorMessages.map((m, i) => <p key={i} className="text-red-500">{m}</p>)}</>
              : <></>}

            <div className="flex justify-end gap-3 pt-2 pb-7">
              <Button
                type="button"
                className="flex gap-2 items-center"
                color="danger"
                onClick={() => method.reset(defaultValues)}
              >
                <ArrowPathIcon className="h-5 w-5" />
                <p>Reset Form</p>
              </Button>
              <Button type="submit" color={curData ? "secondary" : "primary"}>
                {curData ? "Save" : "Register"} Sample Information
              </Button>
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
                formSchemas={formSchemas}
              />

              {/* Saved Items */}
              <div className="min-h-[11rem] bg-gray-100 rounded-lg my-5">
                {data.length === 0
                  ? (
                    <p className="px-3 py-3 text-2xl font-semibold">
                      No sample is registered
                    </p>
                  )
                  : ""}
                <div className="flex flex-wrap gap-3 px-2 py-3">
                  {data.map((d, i) => {
                    const isSelected = curData && curData.index === i;
                    return (
                      <Chip
                        className={tw(
                          apply(
                            "flex items-center",
                            isSelected
                              ? "bg-green-600 text-white outline-none ring ring-green-300 ring-opacity-80"
                              : "",
                          ),
                        )}
                        key={i}
                      >
                        <p className="pr-3 font-bold text-xl">
                          {`${d["sample_title"] as string} (${d[biological_replicates_number_name] as number})`}
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
                      formSchemas,
                      {
                        bioproject_id,
                        organism,
                        sub_species,
                        taxonomy_id,
                        description: "generated_by: biosample_generator;",
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
