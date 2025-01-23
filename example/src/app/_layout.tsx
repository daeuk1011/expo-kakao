import ExpoKakao from "expo-kakao";
import { Stack, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useMount } from "../hooks/useMount";

export default function RootLayout() {
  const { code } = useGlobalSearchParams<{ code?: string }>();
  const accessTokenIssued = useRef(false);
  useEffect(() => {
    const go = async () => {
      const { accessToken } = await ExpoKakao.issueAccessTokenWithCodeWeb({
        code: code!,
        redirectUri: "http://localhost:8082",
        clientSecret: "Hf0jmPY5GTCUGhLyNEf9ghikKdsNU6y8",
      });

      ExpoKakao.setAccessTokenWeb(accessToken);
      accessTokenIssued.current = true;
    };

    if (code && !accessTokenIssued.current) {
      go();
    }
  }, [code]);

  useMount(() => {
    ExpoKakao.initializeKakaoSDK("89baf734b7c006ae5fad42c60226844d", {
      web: {
        javascriptKey: "7e556fcfd7bd60ec1a36f9f814c6d9ce",
        restApiKey: "1909677e56e89d2351b73fc14c2223a0",
      },
    });
  });

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: true,
          contentStyle: { backgroundColor: "black" },
          headerTintColor: "white",
          headerStyle: { backgroundColor: "black" },
          title: "테스트",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="user" />
      </Stack>
    </SafeAreaProvider>
  );
}
