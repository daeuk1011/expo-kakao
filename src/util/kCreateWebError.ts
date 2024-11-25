export type KakaoPackageErrorCodes =
  | "Package-Unknown"
  | "Package-Assertion"
  | "Package-Unauthorized"
  | (string & {});
export function kCreateWebError({
  code = "Package-Unknown",
  message = "",
  msg = "",
  isApiFailed = false,
  isAppsFailed = false,
  isAuthFailed = false,
  isClientFailed = false,
  isInvalidTokenError = false,
  nativeErrorMessage = "",
}: {
  message?: string;
  msg?: string;
  code?: KakaoPackageErrorCodes;
  isAppsFailed?: boolean;
  isInvalidTokenError?: boolean;
  isAuthFailed?: boolean;
  isClientFailed?: boolean;
  isApiFailed?: boolean;
  nativeErrorMessage?: string;
}) {
  // eslint-disable-next-line no-throw-literal
  throw {
    code: code + "",
    message: (msg || message || "unknown") + "",
    userInfo: {
      isAppsFailed,
      isInvalidTokenError,
      isClientFailed,
      isAuthFailed: isAuthFailed || (code + "").includes("401"),
      fatal: true,
      isApiFailed,
      nativeErrorMessage,
    },
  };
}
