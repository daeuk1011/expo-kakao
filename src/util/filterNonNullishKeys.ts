type Options = {
  preserveNull?: boolean;
  preserveUndefined?: boolean;
  excludeEmptyString?: boolean;
};

const defaultOptions: Options = {
  preserveNull: false,
  preserveUndefined: false,
  excludeEmptyString: false,
};

export function filterNonNullishKeys<T extends object>(
  source: T,
  options: Options = defaultOptions,
): T {
  const mergedOptions: Options = { ...defaultOptions, ...options };
  const ret = {};
  Object.entries(source).forEach(([k, v]) => {
    if (v === null && !mergedOptions.preserveNull) {
      return;
    }

    if (v === undefined && !mergedOptions.preserveUndefined) {
      return;
    }

    if (typeof v === "string" && !v && mergedOptions.excludeEmptyString) {
      return;
    }

    ret[k] = v;
  });

  return ret as T;
}
