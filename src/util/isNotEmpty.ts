export const isNotEmptyArray = (arr?: any[]): boolean =>
  Array.isArray(arr) && arr.length > 0;
