function isIntLike(input: string | number): boolean {
  if (typeof input === "number") {
    return true;
  }

  return Number.isInteger(parseFloat(input));
}

export function arrayGivenArrayLike(input: any): any {
  // sometimes Koji VCCs contain "array-like" objects, where
  // the keys are all numbers. In other words, the object looks
  // like an array, but isn't one.

  // For example: {"0": "value", "1": "value", "2": "value"}

  // This function attempts to detect those objects and
  // convert them to actual JS arrays

  if (input == null) {
    return input;
  }

  if (Array.isArray(input)) {
    return input;
  }

  if (typeof input !== "object") {
    return input;
  }

  const everyKeyIsInt = Object.keys(input).every((key) => isIntLike(key));
  if (!everyKeyIsInt || Object.keys(input).length === 0) {
    return input;
  }

  const result: any[] = [];
  Object.keys(input).forEach((key) => {
    result[parseInt(key)] = input[key];
  });

  return result;
}
