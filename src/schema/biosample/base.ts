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
}];
