import { kCreateWebError } from "./kCreateWebError";

export async function kRunWebAPI<T>(fn: () => Promise<T> | T): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    console.log(e);
    throw kCreateWebError(e);
  }
}
