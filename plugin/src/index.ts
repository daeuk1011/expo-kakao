import type { ConfigPlugin } from "expo/config-plugins";
import { createRunOncePlugin } from "expo/config-plugins";

import { KakaoAndroidConfig, KakaoIosConfig } from "./type";
import { withAndroid } from "./withAndroid";
import { withIos } from "./withIos";

const withKakao: ConfigPlugin<{
  nativeAppKey: string;
  android?: KakaoAndroidConfig;
  ios?: KakaoIosConfig;
}> = (config, { nativeAppKey, android, ios }) => {
  if (!nativeAppKey) {
    throw new Error(
      "[@expo-kakao] 'nativeAppKey' missing in expo config plugin value",
    );
  }

  if (android) {
    config = withAndroid(config, { android, nativeAppKey });
  }

  if (ios) {
    config = withIos(config, { ios, nativeAppKey });
  }

  return config;
};

const pkg = require("../../package.json");

export default createRunOncePlugin(withKakao, pkg.name, pkg.version);
