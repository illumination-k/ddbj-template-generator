import { BiosampleTaxonomySchema } from "..";
import formSchemas from "./formSchemas";

export const MPOLYMORPHA_TAXONOMY_ID = "1480154";

export const MPOLYMORPHA_SCHEMA: BiosampleTaxonomySchema = {
  type: "plant",
  fixedData: {
    geo_loc_name: "not applicable",
  },
  organism: "Marchantia polymorpha subsp. ruderalis",
  taxonomy_id: MPOLYMORPHA_TAXONOMY_ID,
  sub_species: "ruderalis",
  formSchemas: formSchemas,
};
