import React from "react";

type FieldBase = {
  label: string;
  name: string;
  help?: string;
  comment?: string;
  required: boolean;
};

export type InputField =
  & { type: "input"; isNumber?: boolean; pattern?: RegExp; defaultValue: number | string }
  & FieldBase;
export type TextField = { type: "text"; example?: string; defaultValue: string } & FieldBase;
export type SelectField = { type: "select"; options: string[]; defaultValue?: string } & FieldBase;
export type RadioboxField = { type: "radio"; options: string[]; defaultValue?: string } & FieldBase;
export type ArrayInputField = { type: "arrayinput"; pattern?: RegExp; defaultValue: { value: string }[] } & FieldBase;

export type UnconditionalField = InputField | TextField | SelectField | RadioboxField | ArrayInputField;
export type ConditionalField = UnconditionalField & { depend: string; dependValue: string; dependType: "eq" | "nq" };

export type Field = UnconditionalField | ConditionalField;
