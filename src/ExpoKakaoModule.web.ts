import { NativeModule, registerWebModule } from "expo";

import { camelCaseObject } from "./util/camelCaseObject";
import { filterNonNullishKeys } from "./util/filterNonNullishKeys";
import { kAssert } from "./util/kAssert";
import { kFetchFormUrlEncoded } from "./util/kFetch";
import kGlobalStorage from "./util/kGlobalStorage";
import { kRunWebAPI } from "./util/kRunWebAPI";

declare const Kakao: {
  init: Function;
  isInitialized: Function;
  Auth: {
    authorize: Function;
    logout: Function;
    setAccessToken: Function;
  };
  API: { request: Function };
};

function isoToUnix(value?: string | number): number | undefined {
  if (typeof value === "string") {
    const timestamp = Date.parse(value);
    if (!isNaN(timestamp)) {
      return Math.floor(timestamp / 1000);
    }
    console.error(`Invalid ISO date string: ${value}`);
    return undefined;
  }

  if (typeof value === "number") {
    return value;
  }

  console.error("Unsupported value type. Expected string or number.");
  return undefined;
}

class ExpoKakaoModule extends NativeModule {
  async initializeKakaoSDK(_appKey: string, options) {
    kAssert(
      options?.web?.javascriptKey,
      "[initializeKakaoSDK] javascriptKey is missing",
    );
    kAssert(
      options?.web?.restApiKey,
      "[initializeKakaoSDK] restApiKey is missing",
    );

    await kRunWebAPI(() => {
      kGlobalStorage.javascriptKey = options?.web?.javascriptKey!;
      kGlobalStorage.restApiKey = options?.web?.restApiKey!;

      if (!Kakao.isInitialized()) {
        Kakao.init(options!.web!.javascriptKey);
      }

      kAssert(Kakao.isInitialized(), "Kakao.isInitialized returns false");
    });
  }

  issueAccessTokenWithCodeWeb({ clientSecret, code, redirectUri }) {
    return kRunWebAPI(async () => {
      const res = await kFetchFormUrlEncoded<{
        token_type: string;
        access_token: string;
        id_token?: string;
        expires_in: number;
        refresh_token: string;
        refresh_token_expires_in: number;
        scope?: string;
      }>("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        body: filterNonNullishKeys({
          grant_type: "authorization_code",
          client_id: kGlobalStorage.restApiKey,
          redirect_uri: encodeURIComponent(redirectUri),
          code,
          client_secret: clientSecret,
        }),
      }).then((r) => r.body);

      return camelCaseObject(res);
    });
  }

  setAccessTokenWeb(token: string) {
    kGlobalStorage.accessToken = token;

    return new Promise((r) => {
      Kakao.Auth.setAccessToken(token);
      r(42);
    });
  }

  login(options: {
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
  }) {
    return kRunWebAPI(() => {
      const {
        loginHint,
        nonce,
        prompt,
        redirectUri,
        scope,
        state,
        throughTalk,
        serviceTerms,
      } = options?.web ?? {};

      return Kakao.Auth.authorize(
        filterNonNullishKeys({
          loginHint,
          nonce,
          prompt: prompt?.join(","),
          redirectUri,
          scope: scope?.join(","),
          serviceTerms: serviceTerms?.join(","),
          state,
          throughTalk,
        }),
      );
    });
  }

  isKakaoTalkLoginAvailable() {
    return false;
  }

  me() {
    return kRunWebAPI(async () => {
      const ret = camelCaseObject(
        await Kakao.API.request({ url: "/v2/user/me" }),
      ) as any;

      return {
        ...ret,
        connectedAt: isoToUnix(ret.connectedAt),
        synchedAt: isoToUnix(ret.synchedAt),
      };
    });
  }
}

export default registerWebModule(ExpoKakaoModule);
