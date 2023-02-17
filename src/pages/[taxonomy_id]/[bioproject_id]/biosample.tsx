import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import BiosampleForm, {
  BiosampleCurrentData,
  BiosampleData,
  BiosampleFormContextProvider,
} from "@/client/features/biosample/BiosampleForm";

import biosample_schema, { BiosampleTaxonomySchema, isTaxonomyId } from "@/schema/biosample";
import Error from "next/error";

const BiosampleGenerator: NextPage = () => {
  const router = useRouter();
  const [curData, setCurData] = useState<BiosampleCurrentData>(undefined);
  const [data, setData] = useState<BiosampleData[]>([]);

  if (!router.isReady) {
    return <>Loading...</>;
  }

  const { bioproject_id, taxonomy_id } = router.query;

  const schema = isTaxonomyId(taxonomy_id) ? biosample_schema[taxonomy_id] : null;

  if (!schema) {
    return <Error statusCode={404} />;
  }

  return (
    <BiosampleFormContextProvider
      value={{
        bioproject_id: bioproject_id as string,
        taxonomy_id: schema.taxonomy_id,
        organism: schema.organism,
        sub_species: schema.sub_species,
        curData,
        setCurData,
        data,
        setData,
        fields: schema.fields,
        fixedData: schema.fixedData,
      }}
    >
      <BiosampleForm />
    </BiosampleFormContextProvider>
  );
};

export default BiosampleGenerator;
