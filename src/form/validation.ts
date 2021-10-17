export type ValidateFnName = "required" | "min" | "max" | "match";

export type ValidateFnType = (param: any) => string | undefined;

const validate = (value: unknown): Record<ValidateFnName, ValidateFnType> => {
  const required = () => (!value ? "the field is required" : undefined);

  const min = (minNum: number) => {
    if (typeof value === "string") {
      return value.length >= minNum
        ? undefined
        : `min length should be ${minNum}`;
    }

    if (typeof value === "number") {
      return value >= minNum ? undefined : `min numbers should be ${minNum}`;
    }

    return "type of field value does not support min/max validation";
  };

  const max = (maxNum: number) => {
    if (typeof value === "string") {
      return value.length <= maxNum
        ? undefined
        : `max length should be ${maxNum}`;
    }

    if (typeof value === "number") {
      return value <= maxNum ? undefined : `max numbers should be ${maxNum}`;
    }

    return "type of field value does not support min/max validation";
  };

  const match = (pattern: RegExp) => {
    if (typeof value === "string") {
      return value.match(pattern)
        ? undefined
        : `should match pattern ${pattern}`;
    }
    return "type of field value does not support regex validation";
  };

  return {
    required,
    min,
    max,
    match
  };
};

export default validate;
