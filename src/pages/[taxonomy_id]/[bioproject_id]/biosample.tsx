import { apply, tw } from "@twind/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { createContext, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import BiosampleForm, {
  BiosampleCurrentData,
  BiosampleData,
  BiosampleFormContextProvider,
} from "@/client/components/BisampleForm";
import { Button } from "@/client/components/Button";
import { Chip } from "@/client/components/Chip";
import FieldForm from "@/client/components/FieldForm";
import FormDisclosure from "@/client/components/FormDisclosure";
import PreviewTable from "@/client/components/PreviewTable";
import createCtx from "@/client/libs/createCtx";
import { attachReplicateToSamplename, attachReplicateToSampleTitle } from "@/client/libs/replicates";
import { Field } from "@/client/types/field";

/*
https://www.ddbj.nig.ac.jp/biosample/attribute.html

required
- sample_name
- sample_title

organism => marchantia polyrmopha
taxonomy id => ?

bioproject_id

isolate? => Tak-1, Tak-2 ... (cultivar, ecotype?)

age, dev-stage => どっちか?どっちも？

tissue => 選択してもらう (and other)
sample_type => single cell, whole plant, sampling tissue (and other)
sex => U, V, UV, Mix,

## Mutation
MpGeneID
Type
Mutatant Name
Note

## Detail
growth_protocol
sampling_details
description

generate biosample
=> 数を選択
=> sample-name, sample-titleを連番で出力

validation:
xsdなど
*/

const basicFields: Field[] = [{
  type: "input",
  label: "Number of biological duplicates",
  name: "number_of_biological_duplicates",
  required: true,
  isNumber: true,
  defaultValue: 3,
}, {
  label: "Sample Name",
  name: "sample_name",
  help: "Unique sample name in this submit",
  required: true,
  type: "input",
  defaultValue: "",
}, {
  label: "Sample Title",
  name: "sample_title",
  help: "Unique sample title in this submit",
  required: true,
  type: "input",
  defaultValue: "",
}, {
  type: "select",
  label: "Tissue",
  name: "tissue",
  help: "Sampling Tissue",
  required: true,
  options: ["Thallus", "Antheridiophore", "Sporeling", "Other"],
}, {
  type: "input",
  label: "Other tissue name",
  name: "unregistered_tissue",
  required: true,
  depend: "tissue",
  dependValue: "Other",
  dependType: "eq",
  defaultValue: "",
}, {
  label: "Isolate",
  name: "isolate",
  help: "Isolate",
  required: true,
  type: "select",
  options: ["Tak-1", "Tak-2", "Kit-2"],
}, {
  type: "radio",
  label: "Sex",
  name: "sex",
  required: true,
  options: ["U", "V", "UV", "Mix", "Unknown"],
}, {
  type: "input",
  label: "Age",
  name: "age",
  comment: "Age or Development Stage is required",
  required: false,
  defaultValue: "",
}, {
  type: "input",
  label: "Development Stage",
  name: "dev-stage",
  comment: "Age or Development Stage is required",
  required: false,
  defaultValue: "",
}];

const genotypeFields: Field[] = [
  {
    type: "radio",
    label: "Strain type",
    name: "strain_type",
    options: ["WT", "Mutant"],
    defaultValue: "WT",
    required: true,
  },
  {
    type: "arrayinput",
    label: "Related MpGeneID",
    name: "rel_mpgeneIDs",
    required: true,
    depend: "strain_type",
    dependValue: "WT",
    dependType: "nq",
    defaultValue: [{ value: "" }],
  },
  {
    type: "select",
    label: "Expression",
    name: "expression",
    required: true,
    options: ["null", "overexpression", "knockdown", "endogenous", "not specified"],
    depend: "strain_type",
    dependValue: "WT",
    dependType: "nq",
  },
  {
    type: "input",
    label: "Mutant Name",
    name: "mutant_name",
    required: true,
    depend: "strain_type",
    dependValue: "WT",
    dependType: "nq",
    defaultValue: "",
  },
  {
    type: "text",
    label: "Mutant construction protocol",
    name: "mutant_construction_protocol",
    required: false,
    comment: "Optional",
    depend: "strain_type",
    dependValue: "WT",
    dependType: "nq",
    defaultValue: "",
  },
];

const materialAndMedhodFields: Field[] = [
  {
    type: "text",
    label: "Growth Protocol",
    name: "growth_protocol",
    required: true,
    defaultValue: "",
  },
  {
    type: "text",
    label: "Sampling Protocol",
    name: "sampling_protocol",
    required: false,
    comment: "Optional",
    defaultValue: "",
  },
];

const BiosampleGenerator: NextPage = () => {
  const router = useRouter();
  const [curData, setCurData] = useState<BiosampleCurrentData>(undefined);
  const [data, setData] = useState<BiosampleData[]>([]);

  if (!router.isReady) {
    return <>Loading...</>;
  }

  const { bioproject_id, taxonomy_id } = router.query;

  return (
    <BiosampleFormContextProvider
      value={{
        bioproject_id: bioproject_id as string,
        taxonomy_id: taxonomy_id as string,
        organism: "Marchantia polymorpha subsp. ruderalis",
        curData,
        setCurData,
        data,
        setData,
        fields: basicFields.concat(genotypeFields, materialAndMedhodFields),
      }}
    >
      <BiosampleForm />
    </BiosampleFormContextProvider>
  );
};

export default BiosampleGenerator;
