import { type ConfigPlugin, withInfoPlist } from "expo/config-plugins";

import type { KakaoIosConfig } from "./type";

const withIos: ConfigPlugin<{
  nativeAppKey: string;
  ios: KakaoIosConfig;
}> = (config, { nativeAppKey }) => {
  if (!nativeAppKey) {
    throw new Error(
      "[expo-kakao] 'nativeAppKey' missing in expo config plugin value",
    );
  }

  config = withInfoPlist(config, (config) => {
    if (!config.modResults.LSApplicationQueriesSchemes) {
      config.modResults.LSApplicationQueriesSchemes = [];
    }

    if (!config.modResults.CFBundleURLTypes) {
      config.modResults.CFBundleURLTypes = [];
    }

    // core
    if (
      config.modResults.CFBundleURLTypes.findIndex((t) =>
        t.CFBundleURLSchemes?.includes(`kakao${nativeAppKey}`),
      ) === -1
    ) {
      config.modResults.CFBundleURLTypes.push({
        CFBundleURLSchemes: [`kakao${nativeAppKey}`],
        CFBundleURLName: "Kakao",
      });
    }

    config.modResults.LSApplicationQueriesSchemes = Array.from(
      new Set([
        ...config.modResults.LSApplicationQueriesSchemes,
        "kakaokompassauth",
      ]),
    );

    config.modResults.KAKAO_APP_KEY = nativeAppKey;

    return config;
  });

  return config;
};

// const withKakaoUserSdkAppDelegate: ConfigPlugin = (config) => {
//   const importRctLinkingManager = "#import <React/RCTLinkingManager.h>";
//   const importMod = "#import <RNCKakaoUser/RNCKakaoUserUtil.h>";

//   const modifyContents = (contents: string): string => {
//     if (!contents.includes(importRctLinkingManager)) {
//       contents = `${importRctLinkingManager}\n${contents}`;
//     }

//     if (!contents.includes(importMod)) {
//       contents = contents.replace(
//         importRctLinkingManager,
//         importRctLinkingManager + "\n" + importMod,
//       );
//     }

//     if (!contents.includes("RNCKakaoUserUtil handleOpenUrl")) {
//       contents = contents.replace(
//         "options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {",
//         `options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//           if([RNCKakaoUserUtil isKakaoTalkLoginUrl:url]) { return [RNCKakaoUserUtil handleOpenUrl:url]; }
//           `,
//       );
//     }

//     return contents;
//   };

//   return withAppDelegate(config, (props) => {
//     const { modResults } = props;
//     if (["objc", "objcpp"].includes(modResults.language)) {
//       modResults.contents = modifyContents(modResults.contents);
//     } else {
//       WarningAggregator.addWarningIOS(
//         "withKakaoUserSdkAppDelegate",
//         "Swift AppDelegate files are not supported yet.",
//       );
//     }

//     return props;
//   });
// };

export { withIos };
