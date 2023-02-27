import { Field } from "@/client/types/field";
import { BiosampleTaxonomySchema } from ".";
import { baseFields } from "./base";

const basicFields: Field[] = [{
  type: "select",
  label: "Tissue",
  name: "tissue",
  help: "Sampling tissue name. If none apply, select unregistered and enter manually.",
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
    "Antheridium",
    "Archegonium",
    "Oil body",
    "Unregistered",
  ],
  defaultValue: "Thallus",
  transforms: [
    {
      template: "#unregistered_tissue",
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
  label: "Specify tissue name",
  name: "unregistered_tissue",
  required: true,
  depend: "tissue",
  dependValue: "Unregistered",
  dependType: "eq",
  defaultValue: "",
}, {
  label: "Isolate",
  name: "isolate",
  help: "Individual isolate from which the sample was obtained. "
    + "If the strain was obtained by crossing, select 'progeneis of' and enter the information of the parents' generation. "
    + "If none apply, select unregistered and enter manually.",
  required: true,
  type: "select",
  options: [
    "Tak-1",
    "RIF-M",
    "Tak-2",
    "RIF-F",
    "Kit-2",
    "BC-3",
    "Cam-1",
    "Cam-2",
    "Melborune Australia",
    "BoGa",
    "Progenies of",
    "Unregistered",
  ],
  defaultValue: "Tak-1",
  transforms: [
    {
      template: "#unregistered_isolate",
      replace_names: ["unregistered_isolate"],
      depend_def: {
        depend: "isolate",
        dependValue: "Unregistered",
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
  label: "Specify isolate name",
  name: "unregistered_isolate",
  required: true,
  depend: "isolate",
  dependValue: "Unregistered",
  dependType: "eq",
  defaultValue: "",
}, {
  label: "Maternal Isolate",
  name: "maternal_isolate",
  help: "Materanl allele of isolate. If none apply, select unregistered and enter manually.",
  required: true,
  type: "select",
  options: ["Tak-2", "Kit-2", "Unregistered"],
  defaultValue: "Tak-2",
  depend: "isolate",
  dependValue: "Progenies of",
  dependType: "eq",
  transforms: [
    {
      template: "#unregistered_maternal_isolate",
      replace_names: ["unregistered_maternal_isolate"],
      depend_def: {
        depend: "maternal_isolate",
        dependValue: "Unregistered",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Specify maternal isolate name",
  name: "unregistered_maternal_isolate",
  required: true,
  depend: "maternal_isolate",
  dependValue: "Unregistered",
  dependType: "eq",
  defaultValue: "",
}, {
  label: "Paternal Isolate",
  name: "paternal_isolate",
  help: "Pateranl allele of isolate. If none apply, select unregistered and enter manually.",
  required: true,
  type: "select",
  options: ["Tak-1", "Unregistered"],
  defaultValue: "Tak-1",
  depend: "isolate",
  dependValue: "Progenies of",
  dependType: "eq",
  transforms: [
    {
      template: "#unregistered_paternal_isolate",
      replace_names: ["unregistered_paternal_isolate"],
      depend_def: {
        depend: "paternal_isolate",
        dependValue: "Unregistered",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Specify paternal isolate name",
  name: "unregistered_paternal_isolate",
  required: true,
  depend: "paternal_isolate",
  dependValue: "Unregistered",
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
  help: "Age at the time of sampling",
  required: false,
  defaultValue: "",
}, {
  type: "input",
  label: "Development Stage",
  name: "dev_stage",
  comment: "Age or Development Stage is required",
  help: "Developmental stages at the time of sampling",
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
        defaultValue: "not specified",
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
    help: "Free-text growth protocol",
    example: [
      {
        name: "Gemmaling",
        content:
          "Plants were cultured on 1/2 Gamborg's B5 medium with 1% agar at 21-22°C under continuous white light condition during 14 days.",
      },
      {
        name: "Sexual organ",
        content:
          "Plants were cultured on 1/2 Gamborg's B5 medium containing 1% sucrose and 1% agar under continuous white light condition at 22°C. "
          + "To induce sexual reproduction, thalli developed from gemmae on 1/2 Gamborg's B5 medium were transferred to soil under continuous white light supplemented with far-red light irradiation",
      },
      {
        name: "Regeneration",
        content:
          "Apical and basal explants were excised from 10-day-old Tak-1 thalli and cultured on 1/2 Gamborg's B5 solid medium",
      },
      {
        name: "Abiotic stress (Heat shock)",
        content: "7-day-old gemmalings grown in liquid 1/2 B5 medium "
          + "were treated at 37C for 0, 1, and 5 h with continuous white light.",
      },
      {
        name: "Abiotic stress (Salt)",
        content: "The gemmae were plated on 1/2 Gamborg B5 medium during 10 days "
          + "supplemented with 20-200 mM NaCl (20 mM steps), and 50-400 mM mannitol (50 mM steps) respectively.",
      },
    ],
  },
  {
    type: "select",
    label: "Sample type",
    name: "sample_type",
    required: true,
    options: ["Whole organism", "Tissue sample", "Unregistered"],
    defaultValue: "Whole organism",
  },
  {
    type: "text",
    label: "Specify sample type detail",
    name: "unregistered_sample_type",
    required: true,
    defaultValue: "",
    depend: "sample_type",
    dependValue: "Unregistered",
    dependType: "eq",
  },
  {
    type: "text",
    label: "Sampling Protocol",
    name: "sampling_protocol",
    required: false,
    comment: "Optional",
    defaultValue: "",
    depend: "sample_type",
    dependValue: "Tissue sample",
    dependType: "eq",
    example: [
      {
        name: "Gametangiophore",
        content:
          "Antheridial receptacles from stage 4 antheridiophores and archegonial receptacles from stage 4 archegoniophores (Higo et al., 2016) were collected and each divided into three pools.",
      },
      {
        name: "Gametangia",
        content:
          "Developing antheridia above approximately 200 µm in length were manually dissected out of hand-sliced antheridiophore receptacles excised from stage 3 to stage 5 antheridiophores (Higo et al., 2016)."
          + "Collected samples were divided into two pools of approximately 200 antheridia.",
      },
    ],
  },
];

export const MPOLYMORPHA_TAXONOMY_ID = "1480154";

export const MPOLYMORPHA_SCHEMA: BiosampleTaxonomySchema = {
  type: "plant",
  fixedData: {
    geo_loc_name: "not applicable",
  },
  organism: "Marchantia polymorpha subsp. ruderalis",
  taxonomy_id: MPOLYMORPHA_TAXONOMY_ID,
  sub_species: "ruderalis",
  fields: baseFields.concat(
    basicFields,
    genotypeFields,
    materialAndMedhodFields,
  ),
};
