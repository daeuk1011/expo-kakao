import { NativeModule, requireNativeModule } from "expo";

import { KakaoSDKOptions } from "./ExpoKakao.types";

declare class ExpoKakaoModule extends NativeModule {
  initializeKakaoSDK(appKey: string, options: KakaoSDKOptions): Promise<void>;
  getKeyHashAndroid(): Promise<string | undefined>;
  issueAccessTokenWithCodeWeb({
    clientSecret,
    code,
    redirectUri,
  }: {
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
  }>;
  setAccessTokenWeb(token: string): Promise<() => void>;
  isKakaoTalkLoginUrl(url: string): Promise<boolean>;
  handleOpenUrl(url: string): Promise<boolean>;
  isKakaoTalkLoginAvailable(): Promise<boolean>;
  login({
    serviceTerms,
    prompts,
    useKakaoAccountLogin,
    scopes,
    web,
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
  }): Promise<Record<string, any>>;
  me(): Promise<Record<string, any>>;
}

export default requireNativeModule<ExpoKakaoModule>("ExpoKakao");
