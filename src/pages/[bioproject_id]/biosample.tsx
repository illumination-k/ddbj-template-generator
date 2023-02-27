import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import BiosampleForm, {
  BiosampleCurrentData,
  BiosampleData,
  BiosampleFormContextProvider,
} from "@/client/features/biosample/BiosampleForm";

import Nav from "@/client/components/Nav";
import biosample_schema, { isTaxonomyId } from "@/schema/biosample";
import Error from "next/error";

const BiosampleGenerator: NextPage = () => {
  const router = useRouter();
  const [curData, setCurData] = useState<BiosampleCurrentData>(undefined);
  const [data, setData] = useState<BiosampleData[]>([]);

  if (!router.isReady) {
    return <>Loading...</>;
  }

  const { bioproject_id } = router.query;
  const taxonomy_id = "1480154";
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
        formSchemas: schema.formSchemas,
        fixedData: schema.fixedData,
      }}
    >
      <Nav />
      <BiosampleForm />
    </BiosampleFormContextProvider>
  );
};

export default BiosampleGenerator;
