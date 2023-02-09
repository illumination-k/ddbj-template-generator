import { Field } from "@/client/types/field";

export const baseFields: Field[] = [{
  label: "Sample Name",
  name: "sample_name",
  help: "Unique sample name in this submission",
  required: true,
  type: "input",
}, {
  label: "Sample Title",
  name: "sample_title",
  help: "Unique sample title in this submission",
  required: true,
  type: "input",
}, {
  type: "input",
  label: "Number of biological replicates",
  name: "replicates_number",
  required: true,
  isNumber: true,
  defaultValue: 3,
  min: 1,
}];
