import { FormSchema } from "@/schema/FormSchema";
import { baseSchemas } from "../base";

const basicSchemas: FormSchema[] = [{
  type: "select",
  label: "Tissue",
  name: "tissue",
  help: "Sampling tissue name. If none apply, select unregistered and enter manually.",
  required: true,
  options: [
    "Thallus",
    "Gemma",
    "Gemma cup",
    "Notch",
    "Midrib",
    "Spore",
    "Sporeling",
    "Sporophyte",
    "Antheridiophore",
    "Archegoniophore",
    "Antheridium",
    "Archegonium",
    "Sperm",
    "Egg",
    "Oil body cell",
    "Other",
  ],
  defaultValue: "Thallus",
  transforms: [
    {
      template: "#unregistered_tissue",
      replace_names: ["unregistered_tissue"],
      depend_def: {
        depend: "tissue",
        dependValue: "Other",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Specify tissue name",
  name: "unregistered_tissue",
  required: true,
  dependDef: {
    depend: "tissue",
    dependValue: "Other",
    dependType: "eq",
  },
  defaultValue: "",
}, {
  label: "Ecotype",
  name: "ecotype",
  help: "Individual ecotype. "
    + "If the strain was obtained by crossing, select 'progenies of' and enter the information of the parents' generation. "
    + "If none applies, select other and specify manually.",
  required: true,
  type: "select",
  options: [
    "Tak-1",
    "Rit-1",
    "Tak-2",
    "Rit-2",
    "Kit-2",
    "BC-3",
    "Cam-1",
    "Cam-2",
    "Aus-M",
    "Aus-F",
    "BoGa",
    "Progenies of",
    "Other",
  ],
  defaultValue: "Tak-1",
  transforms: [
    {
      template: "#unregistered_ecotype",
      replace_names: ["unregistered_ecotype"],
      depend_def: {
        depend: "ecotype",
        dependValue: "Other",
        dependType: "eq",
      },
    },
    {
      template: "Progenies of #maternal_ecotype and #paternal_ecotype",
      replace_names: ["maternal_ecotype", "paternal_ecotype"],
      depend_def: {
        depend: "ecotype",
        dependValue: "Progenies of",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Specify ecotype name",
  name: "unregistered_ecotype",
  required: true,
  dependDef: { depend: "ecotype", dependValue: "Other", dependType: "eq" },
  defaultValue: "",
}, {
  label: "Maternal ecotype",
  name: "maternal_ecotype",
  help: "Materanl allele of ecotype. If none applies, select other and specify manually.",
  required: true,
  type: "select",
  options: ["Tak-2", "Rit-2", "BC3-38", "Kit-2", "Aus-F", "Other"],
  defaultValue: "Tak-2",
  dependDef: {
    depend: "ecotype",
    dependValue: "Progenies of",
    dependType: "eq",
  },
  transforms: [
    {
      template: "#unregistered_maternal_ecotype",
      replace_names: ["unregistered_maternal_ecotype"],
      depend_def: {
        depend: "maternal_ecotype",
        dependValue: "Other",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Specify maternal ecotype name",
  name: "unregistered_maternal_ecotype",
  required: true,
  dependDef: { depend: "maternal_ecotype", dependValue: "Other", dependType: "eq" },
  defaultValue: "",
}, {
  label: "Paternal ecotype",
  name: "paternal_ecotype",
  help: "Pateranl allele of ecotype. If none applies, select other and specify manually.",
  required: true,
  type: "select",
  options: ["Tak-1", "Rit-1", "Aus-M", "Other"],
  defaultValue: "Tak-1",
  dependDef: { depend: "ecotype", dependValue: "Progenies of", dependType: "eq" },
  transforms: [
    {
      template: "#unregistered_paternal_ecotype",
      replace_names: ["unregistered_paternal_ecotype"],
      depend_def: {
        depend: "paternal_ecotype",
        dependValue: "Other",
        dependType: "eq",
      },
    },
  ],
}, {
  type: "input",
  label: "Specify paternal ecotype name",
  name: "unregistered_paternal_ecotype",
  required: true,
  dependDef: { depend: "paternal_ecotype", dependValue: "Other", dependType: "eq" },
  defaultValue: "",
}, {
  type: "radio",
  label: "Sex",
  name: "sex",
  required: true,
  help:
    "Please specify genetic sex. female (U), male (V), hermaphrodite (UV / Sporophyte), pooled male, and female (Spores/Sporelings)",
  options: [
    "female",
    "male",
    "hermaphrodite",
    "pooled male and female",
    "not determined",
  ],
}, {
  type: "input",
  label: "Age",
  name: "age",
  comment: "Age or Development Stage is required",
  help: "Age at the time of sampling",
  required: false,
  placeholder: "14 days old",
  defaultValue: "",
}, {
  type: "input",
  label: "Development stage",
  name: "dev_stage",
  comment: "Age or Development Stage is required",
  help: "Developmental stages at the time of sampling",
  required: false,
  placeholder: "Immature antheridiophore",
  defaultValue: "",
}];

const genotypeSchemas: FormSchema[] = [
  {
    type: "radio",
    label: "Genetic modification",
    name: "genetic_modification",
    options: ["No modification (WT)", "Mutant/Transgenic"],
    defaultValue: "No modification (WT)",
    required: true,
  },
  {
    type: "input",
    label: "Line name",
    name: "line_name",
    required: false,
    comment: "Optional",
    dependDef: { depend: "genetic_modification", dependValue: "No modification (WT)", dependType: "nq" },

    defaultValue: "",
  },
  {
    type: "nestedarray",
    label: "Mutated/Manupulated Genes",
    name: "mutated_manipulated_genes",
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
      {
        type: "select",
        label: "Type",
        name: "type",
        defaultValue: "genome editing",
        options: [
          "genome editing",
          "as transgene",
          "knock-in",
          "gene targeting",
          "EMS",
          "T-DNA tagging",
          "not specified",
        ],
      },
    ],
    dependDef: { depend: "genetic_modification", dependValue: "No modification (WT)", dependType: "nq" },
  },
  {
    type: "text",
    label: "Mutant/Trasngenic construction protocol",
    name: "mutatnt_transgenic_construction_protocol",
    required: false,
    comment: "Optional",
    dependDef: { depend: "genetic_modification", dependValue: "No modification (WT)", dependType: "nq" },
    defaultValue: "",
  },
];

const materialAndMedhodSchemas: FormSchema[] = [
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
          "Plants were cultured on 1/2 Gamborg's B5 medium with 1% agar at 21-22 degrees Celsius under continuous white light condition during 5 days.",
      },
      {
        name: "Thallus",
        content:
          "Plants were cultured on 1/2 Gamborg's B5 medium with 1% agar at 21-22 degrees Celsius under continuous white light condition during 14 days.",
      },
      {
        name: "Sexual organ",
        content:
          "Plants were cultured on 1/2 Gamborg's B5 medium containing 1% sucrose and 1% agar under continuous white light condition at 22 degrees Celsius. "
          + "To induce sexual reproduction, thalli developed from gemmae on 1/2 Gamborg's B5 medium were transferred to soil under continuous white light supplemented with far-red light irradiation.",
      },
      {
        name: "Regeneration",
        content:
          "Apical and basal explants were excised from 10-day-old Tak-1 thalli and cultured on 1/2 Gamborg's B5 solid medium.",
      },
      {
        name: "Abiotic stress (Heat shock)",
        content: "7-day-old gemmalings grown in liquid 1/2 B5 medium "
          + "were treated at 37 degrees Celsius for 0, 1, and 5 h with continuous white light.",
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
    options: ["Whole organism", "Tissue sample", "Other"],
    defaultValue: "Whole organism",
  },
  {
    type: "text",
    label: "Specify sample type detail",
    name: "unregistered_sample_type",
    required: true,
    defaultValue: "",
    dependDef: { depend: "sample_type", dependValue: "Other", dependType: "eq" },
  },
  {
    type: "text",
    label: "Sampling Protocol",
    name: "sampling_protocol",
    required: false,
    comment: "Optional",
    defaultValue: "",
    dependDef: { depend: "sample_type", dependValue: "Tissue sample", dependType: "eq" },
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

const SchemaSchema = baseSchemas.concat(basicSchemas, genotypeSchemas, materialAndMedhodSchemas);

export default SchemaSchema;
