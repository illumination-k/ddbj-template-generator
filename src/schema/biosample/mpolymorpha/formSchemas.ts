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
  dependDef: {
    depend: "tissue",
    dependValue: "Unregistered",
    dependType: "eq",
  },
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
  dependDef: { depend: "isolate", dependValue: "Unregistered", dependType: "eq" },
  defaultValue: "",
}, {
  label: "Maternal Isolate",
  name: "maternal_isolate",
  help: "Materanl allele of isolate. If none apply, select unregistered and enter manually.",
  required: true,
  type: "select",
  options: ["Tak-2", "Kit-2", "Unregistered"],
  defaultValue: "Tak-2",
  dependDef: {
    depend: "isolate",
    dependValue: "Progenies of",
    dependType: "eq",
  },
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
  dependDef: { depend: "maternal_isolate", dependValue: "Unregistered", dependType: "eq" },
  defaultValue: "",
}, {
  label: "Paternal Isolate",
  name: "paternal_isolate",
  help: "Pateranl allele of isolate. If none apply, select unregistered and enter manually.",
  required: true,
  type: "select",
  options: ["Tak-1", "Unregistered"],
  defaultValue: "Tak-1",
  dependDef: { depend: "isolate", dependValue: "Progenies of", dependType: "eq" },
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
  dependDef: { depend: "paternal_isolate", dependValue: "Unregistered", dependType: "eq" },
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

const genotypeSchemas: FormSchema[] = [
  {
    type: "radio",
    label: "Strain type",
    name: "strain_type",
    options: ["WT", "Mutant/Transgenic"],
    defaultValue: "WT",
    required: true,
  },
  {
    type: "input",
    label: "Strain name",
    name: "strain_name",
    required: false,
    comment: "Optional",
    dependDef: { depend: "strain_type", dependValue: "WT", dependType: "nq" },

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
      {
        type: "select",
        label: "Type",
        name: "type",
        defaultValue: "genome editing",
        options: ["genome editing", "transgenic", "EMS", "T-DNA tagging", "not specified"],
      },
    ],
    dependDef: { depend: "strain_type", dependValue: "WT", dependType: "nq" },
  },
  {
    type: "text",
    label: "Mutant construction protocol",
    name: "mutant_construction_protocol",
    required: false,
    comment: "Optional",
    dependDef: { depend: "strain_type", dependValue: "WT", dependType: "nq" },
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
    dependDef: { depend: "sample_type", dependValue: "Unregistered", dependType: "eq" },
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
