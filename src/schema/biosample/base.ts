import { FormSchema } from "@/schema/FormSchema";

export const biological_replicates_number_name = "number_of_biological_replicates";

export const baseSchemas: FormSchema[] = [{
  label: "Sample name",
  name: "sample_name",
  help: "Sample name is the name given to the sample by the registrant, unique per submission.",
  required: true,
  type: "input",
}, {
  label: "Sample title",
  name: "sample_title",
  help: "The title should be brief and descriptive of the sample. The title must be unique in this submission.",
  required: true,
  type: "input",
}, {
  type: "input",
  label: "Number of biological replicates",
  name: biological_replicates_number_name,
  required: true,
  isNumber: true,
  defaultValue: 3,
  min: 1,
}, {
  type: "input",
  label: "Collection date",
  name: "collection_date",
  required: true,
  help: "The date the sample was collected. Please specify at least the closest year in the ISO 8601 format",
  pattern: /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i,
  errorTemplate:
    "ISO 8601 format: YYYY, YYYY-MM, YYYY-MM-DD, YYYY-MM-DDThh:mm:ss.sTZD, YYYY-MM-DDThh:mm:ssTZD, YYYY-MM-DDThh:mmTZD",
}];
