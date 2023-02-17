import { ddbj_schema } from "./generateTemplate";
import { biosampleValueToString } from "./generateTemplate";
import { BiosampleData } from "./types";

export function validateData(
  curData: BiosampleData,
  existData: BiosampleData[],
  fixedData?: { [key: string]: string },
) {
  const error_messages: string[] = [];
  const data = { ...curData, ...fixedData };

  const sample_name = data["sample_name"];
  const sample_title = data["sample_title"];

  const existSampleNames = existData.map((d) => d["sample_name"]);
  const existSampleTitles = existData.map((d) => d["sample_title"]);
  if (existSampleNames.includes(sample_name)) {
    error_messages.push(`Sample name is not Unique. Currently ${existSampleNames.join(",")} are registerd`);
  }

  if (existSampleTitles.includes(sample_title)) {
    error_messages.push(`Sample title is not Unique. Currently ${existSampleTitles.join(",")} are registerd`);
  }

  const curKeys = Object.keys(data);
  const required = ddbj_schema.plant.required;
  required.forEach((required_key) => {
    if (!curKeys.includes(required_key)) {
      throw `${required_key} is required! Please re-consider schema`;
    }

    if (biosampleValueToString(data[required_key]) === "") {
      error_messages.push(`${required_key} is required!`);
    }
  });

  const combination_required = ddbj_schema.plant.combination_required;
  combination_required.forEach(([k1, k2]) => {
    if (!curKeys.includes(k1) && !curKeys.includes(k2)) {
      throw `${k1} or ${k2} is required! Please re-consider schema`;
    }

    if (biosampleValueToString(data[k1]) === "" && biosampleValueToString(data[k2]) === "") {
      error_messages.push(`${k1} or ${k2} is required!`);
    }
  });

  return error_messages;
}
