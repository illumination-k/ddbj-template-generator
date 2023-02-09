type BiosampleValueScalar = string | number | undefined;

type BiosampleValue =
  | BiosampleValueScalar
  | { value: string }[]
  | { [key: string]: BiosampleValueScalar }[];

export type BiosampleData = { [key: string]: BiosampleValue };
