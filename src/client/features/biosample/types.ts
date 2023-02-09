export type BiosampleValueScalar = string | number | undefined;

export type BiosampleValue =
  | BiosampleValueScalar
  | { value: string }[]
  | { [key: string]: BiosampleValueScalar }[];

export type BiosampleData = { [key: string]: BiosampleValue };

export type BiosampleCurrentData = { index: number; data: BiosampleData } | undefined;
