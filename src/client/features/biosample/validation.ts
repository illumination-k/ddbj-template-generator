import { BiosampleData } from "./types";

export function validateData(
  curData: BiosampleData,
  existData: BiosampleData[],
) {
  const error_messages: string[] = [];

  const sample_name = curData["sample_name"];
  const sample_title = curData["sample_title"];

  const existSampleNames = existData.map((d) => d["sample_name"]);
  const existSampleTitles = existData.map((d) => d["sample_title"]);
  if (existSampleNames.includes(sample_name)) {}

  return error_messages;
}
