import { Field } from "@/client/types/field";

import isDepend from "@/client/libs/isDepend";
import { BiosampleData, BiosampleValue, BiosampleValueScalar } from "./types";

type SampleType = "plant";

export const ddbj_schema = {
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

function attachReplicateToSamplename(sample_name: string, replicateNumber: number) {
  return `${sample_name}-${replicateNumber}`;
}

function attachReplicateToSampleTitle(sample_title: string, replicateNumber: number) {
  return `${sample_title} replicate-${replicateNumber}`;
}

export function biosampleValueScalerToString(val: BiosampleValueScalar): string {
  if (!val) {
    return "";
  } else if (typeof val === "string") {
    return val;
  } else if (typeof val === "number") {
    if (isNaN(val)) {
      return "";
    }

    return val.toString();
  } else {
    throw "Unreacheable";
  }
}

// Fieldのtransformsを再帰的に適用する
// 循環参照にならないように注意
// 最高再帰回数は5
function recursiveTransform(data: BiosampleData, curField: Field, allFields: Field[], depth: number = 0): string {
  const self = biosampleValueToString(data[curField.name]);
  if (!curField.transforms) {
    return self;
  }

  if (depth > 5) {
    return self;
  }

  return curField.transforms.reduce((p, t) => {
    const { depend, dependValue, dependType } = t.depend_def;
    if (!isDepend(data[depend], dependValue, dependType)) {
      return p;
    }

    return t.replace_names.reduce((p, name) => {
      const findex = allFields.map((f) => f.name).indexOf(name);
      if (findex === -1) {
        return p;
      }

      const f = allFields[findex];

      if (!f.transforms) {
        const value = biosampleValueToString(data[name]);
        return p.replace(`#${name}`, value);
      }

      return p.replace(`#${name}`, recursiveTransform(data, f, allFields, depth + 1));
    }, t.template.replace("#self", self));
  }, self);
}

export function biosampleValueToString(val: BiosampleValue): string {
  if (!val) {
    return "";
  } else if (typeof val === "string") {
    return val;
  } else if (typeof val === "number") {
    if (isNaN(val)) {
      return "";
    }

    return val.toString();
  } else {
    if (val.length === 0) {
      return "";
    }

    if (Object.keys(val[0]).length === 1 && Object.keys(val[0]).includes("value")) {
      return val.filter((v) => v.value !== "").map((v) => v.value).join(",");
    } else {
      return val.map((v) =>
        Object.entries(v).map(([key, value]) => {
          return `${key}:${biosampleValueScalerToString(value)}`;
        })
      ).join(";");
    }
  }
}

export function generateDDBJTemplateTsv(
  data: BiosampleData[],
  fields: Field[],
  fixedData: { [key: string]: string | undefined },
  sep = "\t",
) {
  // headerの最初がsample_nameである必要がある
  const header: string[] = (fields.map((f) => attachAstarisks(f.name))).concat(Object.keys(fixedData));
  // 最終行にreplicateの情報を加える
  // https://www.ddbj.nig.ac.jp/biosample/validation.html#BS_R0024
  header.push("biological_replicate");

  // biological replicateのgroupごとに一意のIDをふる
  header.push("biological_replicate_group_id");

  const fixedBodyData = Object.values(fixedData).map((v) => biosampleValueScalerToString(v));

  let body: string[][] = [];

  data.forEach((d, biological_replicate_group_id) => {
    // Number of duplicatesの数だけエレメントを作成
    const replicates_number = d["replicates_number"] as number;

    for (let i = 0; i < replicates_number; i++) {
      let elems: string[] = [];
      fields.forEach((f) => {
        const val = biosampleValueToString(d[f.name]);

        // sample nameとsample titleにreplicate情報の追加
        if (f.name === "sample_name") {
          elems.push(attachReplicateToSamplename(val, i + 1));
          return;
        } else if (f.name === "sample_title") {
          elems.push(attachReplicateToSampleTitle(val, i + 1));
          return;
        }

        // processing transform definition
        // ある値の時に他のデータを参照しながら値を変更できる
        if (f.transforms && f.transforms.length !== 0) {
          const e = recursiveTransform(d, f, fields);
          elems.push(e);

          return;
        }

        elems.push(val);
      });

      body.push(
        elems
          .concat(fixedBodyData)
          .concat([`biological replicate ${i + 1}`])
          .concat([`${fixedData["bioproject_id"]}-${biological_replicate_group_id + 1}`]),
      );
    }
  });

  let emptyFlags: boolean[] = [];

  if (body.length === 0) {
    return [header.join(sep)];
  }

  for (let x = 0; x < body[0].length; x++) {
    let ok = false;
    for (let y = 0; y < body.length; y++) {
      if (body[y][x] !== "") {
        ok = true;
      }
    }
    emptyFlags.push(ok);
  }

  return [header.filter((_, i) => emptyFlags[i]).join(sep)].concat(
    body.map((b) => b.filter((_, i) => emptyFlags[i]).join(sep)),
  );
}
