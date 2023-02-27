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
  errorTemplate?: string;
  required: boolean;
  transforms?: FieldTransform[];
};

type InputNumberField = {
  isNumber: true;
  min?: number;
  max?: number;
  defaultValue?: number;
};

type InputStringField = {
  isNumber?: false;
  pattern?: RegExp;
  defaultValue?: string;
};

type InputFieldType = InputNumberField | InputStringField;

export type InputField =
  & { type: "input" }
  & FieldBase
  & InputFieldType;

export type TextExample = string | { name: string; content: string }[];

export type TextField =
  & { type: "text"; example?: string | TextExample; defaultValue: string }
  & FieldBase;
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
  }
  & InputFieldType
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
