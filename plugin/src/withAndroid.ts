import type { ConfigPlugin } from "expo/config-plugins";
import { AndroidConfig, withAndroidManifest } from "expo/config-plugins";

import { KakaoAndroidConfig } from "./type";

const withAndroid: ConfigPlugin<{
  nativeAppKey: string;
  android: KakaoAndroidConfig;
}> = (config, { android: { authCodeHandlerActivity }, nativeAppKey }) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );

    mainApplication.activity?.push({
      $: {},
    } as AndroidConfig.Manifest.ManifestActivity);

    const injectActivity = ({
      activityName,
      activity,
    }: {
      activityName: string;
      activity: AndroidConfig.Manifest.ManifestActivity;
    }) => {
      mainApplication.activity = [
        ...(mainApplication.activity || []).filter(
          (a) =>
            a &&
            a.$ &&
            a.$["android:name"] !== activityName &&
            a.$["android:name"],
        ),
        activity,
      ];
    };

    if (authCodeHandlerActivity) {
      const name = "com.kakao.sdk.auth.AuthCodeHandlerActivity";

      injectActivity({
        activity: {
          $: {
            "android:name": name,
            "android:exported": "true",
          },
          "intent-filter": [
            {
              action: [
                {
                  $: {
                    "android:name": "android.intent.action.VIEW",
                  },
                },
              ],
              category: [
                { $: { "android:name": "android.intent.category.DEFAULT" } },
                { $: { "android:name": "android.intent.category.BROWSABLE" } },
              ],
              data: [
                {
                  $: {
                    "android:host": "oauth",
                    "android:scheme": `kakao${nativeAppKey}`,
                  },
                },
              ],
            },
          ],
        },
        activityName: name,
      });
    }

    return config;
  });

  return config;
};

export { withAndroid };
