import { FormSchema, SelectFormSchema } from "@/schema/FormSchema";
import { BiosampleTaxonomySchema, SampleType } from ".";

type ValidationSchema = {
  [key in SampleType]: {
    required: string[];
    combination_required: string[][];
  };
};

export const DDBJ_SCHEMA: ValidationSchema = {
  plant: {
    required: [
      "sample_name",
      "sample_title",
      // "organism" // Organism is registered in schema level
      "geo_loc_name",
    ],
    combination_required: [
      ["age", "dev_stage"],
      ["isolate", "ecotype", "cultivar"],
    ],
  },
};

function getFormSchema(name: string, FormSchemas: FormSchema[]): FormSchema {
  const f = FormSchemas.find((f) => f.name == name);
  if (!f) {
    throw `${name} does not exist in FormSchemas`;
  }

  return f;
}

function validateDependDef() {}

function validateSelectFormSchema(f: SelectFormSchema, FormSchemaNames: string[]) {}

export function validate(taxonomy_schema: BiosampleTaxonomySchema, validtion_schema: ValidationSchema) {
  const errorMessages: string[] = [];
  const names = taxonomy_schema.formSchemas.map((f) => f.name);

  // FormSchemaに必要な情報が揃っているかの確認
  const allSchemaNames = names.concat(Object.keys(taxonomy_schema.fixedData));

  validtion_schema[taxonomy_schema.type].required.forEach((requiredName) => {
    if (!allSchemaNames.includes(requiredName)) {
      errorMessages.push(`${requiredName} is not exist in schema`);
    }
  });

  validtion_schema[taxonomy_schema.type].combination_required.forEach((combination_required) => {
    let ok = false;
    combination_required.forEach((c) => {
      if (allSchemaNames.includes(c)) {
        ok = true;
      }
    });

    if (!ok) {
      errorMessages.push(`At least one of ${combination_required.join(",")} are required!`);
    }
  });

  // filedの中身の確認
  taxonomy_schema.formSchemas.forEach((f) => {
    if ("dependDef" in f) {
      // Conditional FormSchemaの場合、dependがちゃんとあるかCheck
      if (!names.includes(f.dependDef.depend)) {
        errorMessages.push(`Depend of ${f.name} does not exist in FormSchemas`);
      }
    }

    switch (f.type) {
      case "select": {
        if (f.defaultValue) {
          if (!f.options.includes(f.defaultValue)) {
            errorMessages.push(`${f.defaultValue} does not exist in choices [${f.options.join(",")}]`);
          }
        }
      }
    }
  });

  return errorMessages;
}
