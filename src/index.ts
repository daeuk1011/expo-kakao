import ExpoKakao from "./ExpoKakao";
import { TKakaoLoginToken, TKakaoUser } from "./ExpoKakao.types";
import { isNotEmptyArray } from "./util/isNotEmpty";
import { kAssert } from "./util/kAssert";
import {
  KakaoPackageErrorCodes,
  kCreateWebError,
} from "./util/kCreateWebError";
import { kFetch, kFetchFormUrlEncoded } from "./util/kFetch";
import kGlobalStorage from "./util/kGlobalStorage";
import { kRunWebAPI } from "./util/kRunWebAPI";

export async function initializeKakaoSDK(
  appKey: string,
  _options?: { web?: { javascriptKey: string; restApiKey: string } },
): Promise<void> {
  ExpoKakao.initializeKakaoSDK(appKey);
}

export function getKeyHashAndroid(): Promise<string | undefined> {
  return ExpoKakao.getKeyHashAndroid();
}

export function login({
  serviceTerms,
  prompts,
  useKakaoAccountLogin,
  scopes,
}: {
  serviceTerms?: string[];
  prompts?: ("Login" | "Create" | "Cert" | "UnifyDaum" | "SelectAccount")[];
  scopes?: string[];
  useKakaoAccountLogin?: boolean;
  web?: {
    redirectUri: string;
    scope?: string[];
    throughTalk?: boolean;
    prompt?: ("login" | "none" | "create" | "select_account")[];
    loginHint?: string;
    serviceTerms?: string[];
    state?: string;
    nonce?: string;
  };
} = {}): Promise<TKakaoLoginToken> {
  kAssert(
    !useKakaoAccountLogin
      ? !isNotEmptyArray(prompts) && !isNotEmptyArray(scopes)
      : true,
    "[login] `prompts` and `scopes` cannot be passed if useKakaoAccountLogin is false.",
  );

  kAssert(
    isNotEmptyArray(scopes)
      ? !isNotEmptyArray(prompts) && !isNotEmptyArray(serviceTerms)
      : true,
    "[login] `scopes` cannot be passed with `prompts` or `serviceTerms`",
  );

  return ExpoKakao.login(
    serviceTerms ?? [],
    prompts ?? [],
    useKakaoAccountLogin ?? false,
    scopes ?? [],
  );
}

export function isKakaoTalkLoginAvailable(): Promise<boolean> {
  return ExpoKakao.isKakaoTalkLoginAvailable();
}

export function me(): Promise<TKakaoUser> {
  return ExpoKakao.me();
}

export function setAccessTokenWeb(token: string) {}

export async function issueAccessTokenWithCodeWeb(params: {
  redirectUri: string;
  clientSecret?: string;
  code: string;
}): Promise<{
  tokenType: string;
  accessToken: string;
  idToken?: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  scope?: string;
}> {
  return {} as any;
}

const KakaoCore = {
  initializeKakaoSDK,
  getKeyHashAndroid,
};

const KakaoUser = {
  login,
  me,
  setAccessTokenWeb,
  issueAccessTokenWithCodeWeb,
  isKakaoTalkLoginAvailable,
};

const Kakao = {
  ...KakaoCore,
  ...KakaoUser,
};

export default Kakao;
export type TKakaoService = typeof Kakao;
export type { KakaoPackageErrorCodes };
export {
  kAssert,
  kCreateWebError,
  kGlobalStorage,
  kFetch,
  kFetchFormUrlEncoded,
  kRunWebAPI,
};
