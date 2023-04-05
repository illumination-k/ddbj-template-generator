export type DependDef = {
  depend: string;
  dependValue: string;
  dependType: "eq" | "nq";
};

type FormValueTransform = {
  template: string;
  replace_names: string[];
  depend_def: DependDef;
};

type FormSchemaBase = {
  label: string;
  name: string;
  help?: string;
  comment?: string;
  errorTemplate?: string;
  required: boolean;
  transforms?: FormValueTransform[];
};

type InputNumberFormSchema = {
  isNumber: true;
  min?: number;
  max?: number;
  defaultValue?: number;
};

type InputStringFormSchema = {
  placeholder?: string;
  isNumber?: false;
  pattern?: RegExp;
  defaultValue?: string;
};

type InputFormSchemaType = InputNumberFormSchema | InputStringFormSchema;

export type InputFormSchema =
  & { type: "input" }
  & FormSchemaBase
  & InputFormSchemaType;

export type TextExample = string | { name: string; content: string }[];

export type TextFormSchema =
  & { type: "text"; example?: string | TextExample; defaultValue: string }
  & FormSchemaBase;
export type SelectFormSchema = { type: "select"; options: string[]; defaultValue?: string } & FormSchemaBase;
export type RadioboxFormSchema = { type: "radio"; options: string[]; defaultValue?: string } & FormSchemaBase;

type NestedArraySchemaBase = {
  name: string;
  label: string;
  required?: boolean;
};

type NestedArraySchemaInput =
  & {
    type: "input";
  }
  & InputFormSchemaType
  & NestedArraySchemaBase;

type NestedArraySchemaSelect = {
  type: "select";
  options: string[];
  defaultValue?: string;
} & NestedArraySchemaBase;

export type NestedArraySchema = NestedArraySchemaInput | NestedArraySchemaSelect;

export type NestedArrayInputFormSchema = { type: "nestedarray"; schemas: NestedArraySchema[] } & FormSchemaBase;

export type UnconditionalFormSchema =
  | InputFormSchema
  | TextFormSchema
  | SelectFormSchema
  | RadioboxFormSchema
  | NestedArrayInputFormSchema;

export type ConditionalFormSchema =
  & UnconditionalFormSchema
  & { dependDef: DependDef };

export type FormSchema = UnconditionalFormSchema | ConditionalFormSchema;
