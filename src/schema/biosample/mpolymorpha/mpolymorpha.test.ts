import { DDBJ_SCHEMA, validate } from "../validation";
import { MPOLYMORPHA_SCHEMA } from ".";

test("Validate Marchantia polymorpha schema", () => {
  const errors = validate(MPOLYMORPHA_SCHEMA, DDBJ_SCHEMA);

  expect([]).toStrictEqual(errors);
});
