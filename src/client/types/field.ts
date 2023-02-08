type DependDef = {
  depend: string;
  dependValue: string;
  dependType: "eq" | "nq";
};

type FieldTransform = {
  template: string;
  replace_names: string[];
  depend_def: DependDef;
};

type FieldBase = {
  label: string;
  name: string;
  help?: string;
  comment?: string;
  required: boolean;
  transforms?: FieldTransform[];
};

export type InputField =
  & { type: "input"; isNumber?: boolean; pattern?: RegExp; defaultValue: number | string }
  & FieldBase;

export type TextField = { type: "text"; example?: string; defaultValue: string } & FieldBase;
export type SelectField = { type: "select"; options: string[]; defaultValue?: string } & FieldBase;
export type RadioboxField = { type: "radio"; options: string[]; defaultValue?: string } & FieldBase;
export type ArrayInputField = { type: "arrayinput"; pattern?: RegExp; defaultValue: { value: string }[] } & FieldBase;

type NestedArraySchemaBase = {
  name: string;
  label: string;
  required?: boolean;
};

type NestedArraySchemaInput =
  & {
    type: "input";
    isNumber?: boolean;
    pattern?: RegExp;
    defaultValue: number | string;
  }
  & NestedArraySchemaBase;

type NestedArraySchemaSelect = {
  type: "select";
  options: string[];
  defaultValue?: string;
} & NestedArraySchemaBase;

export type NestedArraySchema = NestedArraySchemaInput | NestedArraySchemaSelect;

export type NestedArrayInputField = { type: "nestedarray"; schemas: NestedArraySchema[] } & FieldBase;

export type UnconditionalField =
  | InputField
  | TextField
  | SelectField
  | RadioboxField
  | ArrayInputField
  | NestedArrayInputField;

export type ConditionalField =
  & UnconditionalField
  & DependDef;

export type Field = UnconditionalField | ConditionalField;
