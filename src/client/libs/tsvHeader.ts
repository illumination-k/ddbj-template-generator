type SampleType = "plant";

const ddbj_schema = {
  plant: {
    required: [
      "sample_name",
      "sample_title",
      "organism",
      "geo_loc_name",
    ],
    combination_required: [
      ["age", "dev_stage"],
      ["isolate", "ecotype", "cultivar"],
    ],
  },
};

export function attachAstarisks(
  key: string,
  format: "ddbj" | "sra" = "ddbj",
  type: SampleType = "plant",
): string {
  if (format === "ddbj") {
    const schema = ddbj_schema[type];

    if (schema.required.includes(key)) {
      return `*${key}`;
    }

    return key;
  } else {
    throw "Not implemented";
  }
}
