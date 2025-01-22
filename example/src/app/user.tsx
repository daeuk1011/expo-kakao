import ExpoKakao from "expo-kakao";
import { useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";

import { useMount } from "../hooks/useMount";

export default function Page() {
  const [isKakaoTalkEnable, setKakaoTalkEnable] = useState(false);
  const [result, setResult] = useState<object>();
  const [scopesResult, setScopesResult] = useState<object>();
  const [serviceTermsResult, setServiceTermsResult] = useState<object>();
  const [shippingResult, setShippingResult] = useState<object>();
  const [meResult, setMeResult] = useState<object>();

  useMount(() => {
    ExpoKakao.isKakaoTalkLoginAvailable().then(setKakaoTalkEnable);
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <Text
        style={{ color: "white" }}
      >{`Kakao Talk Available: ${isKakaoTalkEnable}`}</Text>
      <Pressable
        onPress={() => {
          ExpoKakao.login({
            web: {
              redirectUri: "http://localhost:8082",
              prompt: ["select_account"],
            },
          })
            .then((ret: any) => {
              alert("Login Success");
              setResult(ret);
            })
            .catch((e: any) => alert(e.message));
        }}
      >
        <Text style={{ color: "white", fontSize: 100 }}>로그인</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          ExpoKakao.me()
            .then((ret: any) => {
              alert("Get profile Success");

              console.log(ret);
              setMeResult(ret);
            })
            .catch((e: any) => {
              alert(e.message);
            });
        }}
      >
        <Text style={{ color: "white", fontSize: 100 }}>프로필</Text>
      </Pressable>

      {/* <PrettyResult label="Login Result" result={result} />
      <PrettyResult label="Scopes Result" result={scopesResult} />
      <PrettyResult label="Service Terms Result" result={serviceTermsResult} />
      <PrettyResult label="Shipping Addresses Result" result={shippingResult} />
      <PrettyResult label="Get Profile Result" result={meResult} /> */}
    </ScrollView>
  );
}
