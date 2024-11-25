import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1"
        />

        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.3/kakao.min.js"
          integrity="sha384-kLbo2SvoNtOFiniJ1EQ9o2iDA8i3xp+O6Cns+L5cd4RsOJfl+43z5pvieT2ayq3C"
          crossOrigin="anonymous"
        />

        <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
  html {
    max-width: 700px;
    margin: 0 auto;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 0px 8px;
    background-color: rgb(245, 245, 245);
  }

  ::-webkit-scrollbar {
    display: none;
  }
  
  input {
    outline-style: none;
  }

  body {
    overflow-y: scroll;
    overscroll-behavior-y: none;
  }

  @media (prefers-color-scheme: dark) {
    body {
      background-color: #fff;
    }
  }
`;
