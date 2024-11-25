export type JSONCandidate =
  | any[]
  | object
  | undefined
  | null
  | string
  | number
  | boolean;

function isArray(objOrArray: JSONCandidate): objOrArray is any[] {
  return Array.isArray(objOrArray);
}

function isPlainObject(value: JSONCandidate): value is object {
  return typeof value === "object" && value !== null && !isArray(value);
}

function camelCase(str: string): string {
  return str
    .trim()
    .replace(/[:-]/g, "_")
    .replace(/(^_+|_+$)/g, "")
    .replace(/_+[a-z0-9]/g, (word) =>
      word.charAt(word.length - 1).toUpperCase(),
    );
}

export function camelCaseObject(objOrArr: JSONCandidate): JSONCandidate {
  if (objOrArr === null || typeof objOrArr !== "object") {
    return objOrArr; // Return as is if not an object or array
  }

  if (isArray(objOrArr)) {
    return objOrArr.map(camelCaseObject);
  }

  if (isPlainObject(objOrArr)) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(objOrArr)) {
      result[camelCase(key)] = camelCaseObject(value);
    }
    return result;
  }

  return objOrArr;
}
