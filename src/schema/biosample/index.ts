import { FormSchema } from "@/schema/FormSchema";
import { MPOLYMORPHA_SCHEMA, MPOLYMORPHA_TAXONOMY_ID } from "./mpolymorpha";

const TAXONOMY_IDS = [MPOLYMORPHA_TAXONOMY_ID] as const;

export type TaxonomyId = typeof TAXONOMY_IDS[number];

export function isTaxonomyId(id: unknown): id is TaxonomyId {
  if (typeof id !== "string") {
    return false;
  }

  return (TAXONOMY_IDS as ReadonlyArray<string>).includes(id);
}

export type SampleType = "plant";

export type BiosampleTaxonomySchema = {
  type: SampleType;
  taxonomy_id: string;
  organism: string;
  sub_species?: string;
  fixedData: { [key: string]: string };
  formSchemas: FormSchema[];
};

export type BiosampleSchema = {
  [key in TaxonomyId]: BiosampleTaxonomySchema;
};

const biosample_schema: BiosampleSchema = {
  [MPOLYMORPHA_TAXONOMY_ID]: MPOLYMORPHA_SCHEMA,
};

export default biosample_schema;
