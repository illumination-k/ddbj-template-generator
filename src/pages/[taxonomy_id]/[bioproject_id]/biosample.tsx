import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import BiosampleForm, {
  BiosampleCurrentData,
  BiosampleData,
  BiosampleFormContextProvider,
} from "@/client/components/BisampleForm";
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
  type: "input",
  label: "Biological replicates number",
  name: "replicates_number",
  required: true,
  isNumber: true,
  defaultValue: 3,
}, {
  type: "select",
  label: "Tissue",
  name: "tissue",
  help: "Sampling Tissue",
  required: true,
  options: [
    "Thallus",
    "Gemme",
    "Gemma cup",
    "Notch",
    "Midrib",
    "Sporeling",
    "Sporophyte",
    "Antheridiophore",
    "Archegoniophore",
    "Archegonium",
    "Archegonia",
    "Oil body",
    "Unregistered",
  ],
  transforms: [
    {
      template: "#unregistered_tissue (Unregistered)",
      replace_names: ["unregistered_tissue"],
      depend_def: {
        depend: "tissue",
        dependValue: "Unregistered",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Unregistered tissue name",
  name: "unregistered_tissue",
  required: true,
  depend: "tissue",
  dependValue: "Unregistered",
  dependType: "eq",
  defaultValue: "",
}, {
  label: "Isolate",
  name: "isolate",
  help: "Isolate",
  required: true,
  type: "select",
  options: [
    "Tak-1",
    "Tak-2",
    "Kit-2",
    "Progenies of",
    "Other",
  ],
  defaultValue: "Tak-1",
  transforms: [
    {
      template: "Other (#unregistered_isolate)",
      replace_names: ["unregistered_isolate"],
      depend_def: {
        depend: "isolate",
        dependValue: "Other",
        dependType: "eq",
      },
    },
    {
      template: "Progenesis of #maternal_isolate and #paternal_isolate",
      replace_names: ["maternal_isolate", "paternal_isolate"],
      depend_def: {
        depend: "isolate",
        dependValue: "Progenies of",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Other isolate name",
  name: "unregistered_isolate",
  required: true,
  depend: "isolate",
  dependValue: "Other",
  dependType: "eq",
  defaultValue: "",
}, {
  label: "Maternal Isolate",
  name: "maternal_isolate",
  help: "Isolate",
  required: true,
  type: "select",
  options: ["Tak-2", "Kit-2", "Other"],
  depend: "isolate",
  dependValue: "Progenies of",
  dependType: "eq",
  transforms: [
    {
      template: "Other (#unregistered_maternal_isolate)",
      replace_names: ["unregistered_maternal_isolate"],
      depend_def: {
        depend: "maternal_isolate",
        dependValue: "Other",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Other maternal isolate name",
  name: "unregistered_maternal_isolate",
  required: true,
  depend: "maternal_isolate",
  dependValue: "Other",
  dependType: "eq",
  defaultValue: "",
}, {
  label: "Paternal Isolate",
  name: "paternal_isolate",
  help: "Isolate",
  required: true,
  type: "select",
  options: ["Tak-1", "Other"],
  depend: "isolate",
  dependValue: "Progenies of",
  dependType: "eq",
  transforms: [
    {
      template: "Other (#unregistered_paternal_isolate)",
      replace_names: ["unregistered_paternal_isolate"],
      depend_def: {
        depend: "paternal_isolate",
        dependValue: "Other",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Other paternal isolate name",
  name: "unregistered_paternal_isolate",
  required: true,
  depend: "paternal_isolate",
  dependValue: "Other",
  dependType: "eq",
  defaultValue: "",
}, {
  type: "radio",
  label: "Sex",
  name: "sex",
  required: true,
  options: ["female", "male", "hermaphrodite", "pooled male and female", "not determined"],
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
  name: "dev_stage",
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
    type: "input",
    label: "Mutant name",
    name: "mutant_name",
    required: false,
    comment: "Optional",
    depend: "strain_type",
    dependValue: "WT",
    dependType: "nq",
    defaultValue: "",
  },
  {
    type: "nestedarray",
    label: "Causal Genes",
    name: "causal_genes",
    help: "If causal gene is not specified, do not enter anything",
    required: false,
    schemas: [
      {
        type: "input",
        name: "mp_gene_id",
        label: "MpGeneID",
        required: true,
        defaultValue: "",
      },
      {
        type: "select",
        label: "Expression",
        name: "expression",
        defaultValue: "null",
        options: ["null", "overexpression", "knockdown", "endogenous", "not specified"],
      },
    ],
    depend: "strain_type",
    dependValue: "WT",
    dependType: "nq",
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
    example: "Example!",
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
