export default function isDepend(val: any, dependValue: any, dependType: "eq" | "nq") {
  if (dependType === "eq") {
    return val === dependValue;
  } else {
    return val !== dependValue;
  }
}
