/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Flatten function remains unchanged
export const flattenObject = (obj: any, parentKey: string = ''): any => {
  const result: any = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        Object.assign(result, flattenObject(obj[key], newKey)); // Recurse into nested object
      } else {
        result[newKey] = obj[key]; // Base case: primitive value, add to result
      }
    }
  }
  return result;
};