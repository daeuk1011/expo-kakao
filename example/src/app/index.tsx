import ExpoKakao from "expo-kakao";
import { router } from "expo-router";
import { useRef } from "react";
import { Animated, Easing, Pressable, ScrollView, Text } from "react-native";

import { useMount } from "../hooks/useMount";

import timing = Animated.timing;
import loop = Animated.loop;

export default function Page() {
  const anim = useRef(new Animated.Value(0)).current;
  useMount(() => {
    loop(
      timing(anim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 10000,
        easing: Easing.linear,
      }),
    ).start();
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <Animated.Image
        source={require("../../assets/icon.png")}
        style={[
          { width: 200, height: 200, resizeMode: "contain" },
          {
            transform: [
              {
                rotate: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      />

      <Pressable
        onPress={() => {
          ExpoKakao.login({
            web: {
              redirectUri: "http://localhost:8082",
              prompt: ["select_account"],
            },
          })
            .then((response: any) => {
              console.log(1234124, response);
              // alert("Login Success");
            })
            .catch((e: any) => {
              console.log("로그인 에러:", e);
              console.dir(e);
            });
        }}
      >
        <Text style={{ color: "white", fontSize: 100 }}>로그인</Text>
      </Pressable>

      <Text
        onPress={() => router.push("/user")}
        style={{ color: "white", fontSize: 100 }}
      >
        테스트
      </Text>
    </ScrollView>
  );
}
