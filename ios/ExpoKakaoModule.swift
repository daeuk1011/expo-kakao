import ExpoModulesCore
import KakaoSDKCommon
import KakaoSDKAuth
import KakaoSDKUser

struct KakaoAuthError: Error {
    let reason: String
}

public class ExpoKakaoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoKakao")

    Constants([
      "PI": Double.pi
    ])

    AsyncFunction("initializeKakaoSDK") { (appKey: String, options: [String: Any]?) -> Void in
    }

    Function("isKakaoTalkLoginUrl") { (url: String) -> Bool in
      guard let urlObj = URL(string: url),
            let _ = try? KakaoSDK.shared.appKey() else { return false }
      return AuthApi.isKakaoTalkLoginUrl(urlObj)
    }

    Function("handleOpenUrl") { (url: String) -> Bool in
      guard let urlObj = URL(string: url),
            let _ = try? KakaoSDK.shared.appKey() else { return false }
      return AuthController.handleOpenUrl(url: urlObj)
    }

    AsyncFunction("isKakaoTalkLoginAvailable") { () -> Bool in
      return UserApi.isKakaoTalkLoginAvailable()
    }

    AsyncFunction("login") { (options: [String: Any]) -> [String: Any] in
      // 옵션을 파싱하여 타입에 맞게 변환
      let serviceTerms = options["serviceTerms"] as? [String] ?? []
      let prompts = options["prompts"] as? [String]
      let useKakaoAccountLogin = options["useKakaoAccountLogin"] as? Bool ?? false
      let scopes = options["scopes"] as? [String] ?? []

      return try await withCheckedThrowingContinuation { continuation in
        let callback: (OAuthToken?, Error?) -> Void = { token, error in
          if let error = error {
            continuation.resume(throwing: KakaoAuthError(reason: error.localizedDescription))
          } else if let token = token {
            continuation.resume(returning: self.tokenToDictionary(token))
          } else {
            continuation.resume(throwing: KakaoAuthError(reason: "Unknown error occurred"))
          }
        }

        // scopes가 비어있지 않은 경우
        if !scopes.isEmpty {
          UserApi.shared.loginWithKakaoAccount(scopes: scopes, completion: callback)
        } 
        // 카카오톡 앱을 통한 로그인 가능하고, useKakaoAccountLogin이 false인 경우
        else if UserApi.isKakaoTalkLoginAvailable(), !useKakaoAccountLogin {
          UserApi.shared.loginWithKakaoTalk(
            serviceTerms: self.emptyArrayToNil(serviceTerms),
            completion: callback
          )
        } 
        // 기본 카카오 계정 로그인을 사용하는 경우
        else {
          UserApi.shared.loginWithKakaoAccount(
            prompts: self.convertPrompts(prompts),
            serviceTerms: self.emptyArrayToNil(serviceTerms),
            completion: callback
          )
        }
      }
    }

    AsyncFunction("me") { () -> [String: Any] in
      return try await withCheckedThrowingContinuation { continuation in
        UserApi.shared.me { user, error in
          if let error = error {
            continuation.resume(throwing: KakaoAuthError(reason: error.localizedDescription))
          } else if let user = user {
            continuation.resume(returning: self.userToDictionary(user))
          } else {
            continuation.resume(throwing: KakaoAuthError(reason: "Unknown error occurred"))
          }
        }
      }
    }
  }

  // MARK: - Helper Methods

  private func emptyArrayToNil<T>(_ arr: [T]?) -> [T]? {
    return (arr?.isEmpty == true) ? nil : arr
  }

  private func convertPrompts(_ prompts: [String]?) -> [Prompt] {
    return prompts?.compactMap { prompt in
        switch prompt {
        case "Login": return .Login
        case "Cert": return .Cert
        case "Create": return .Create
        case "UnifyDaum": return .UnifyDaum
        case "SelectAccount": return .SelectAccount
        default: return nil
        }
    } ?? []
}
  private func tokenToDictionary(_ token: OAuthToken) -> [String: Any] {
    return [
      "accessToken": token.accessToken,
      "refreshToken": token.refreshToken,
      "tokenType": token.tokenType,
      "idToken": token.idToken as Any,
      "accessTokenExpiresAt": token.expiredAt.timeIntervalSince1970,
      "refreshTokenExpiresAt": token.refreshTokenExpiredAt.timeIntervalSince1970,
      "accessTokenExpiresIn": token.expiresIn,
      "refreshTokenExpiresIn": token.refreshTokenExpiresIn,
      "scopes": token.scopes ?? []
    ]
  }

  private func userToDictionary(_ user: User) -> [String: Any] {
    return [
      "id": user.id as Any,
      "name": user.kakaoAccount?.name as Any,
      "email": user.kakaoAccount?.email as Any,
      "nickname": user.kakaoAccount?.profile?.nickname as Any,
      "profileImageUrl": user.kakaoAccount?.profile?.profileImageUrl?.absoluteString as Any,
      "thumbnailImageUrl": user.kakaoAccount?.profile?.thumbnailImageUrl?.absoluteString as Any,
      "phoneNumber": user.kakaoAccount?.phoneNumber as Any,
      "ageRange": user.kakaoAccount?.ageRange?.rawValue as Any,
      "birthday": user.kakaoAccount?.birthday as Any,
      "birthdayType": user.kakaoAccount?.birthdayType as Any,
      "birthyear": user.kakaoAccount?.birthyear as Any,
      "gender": user.kakaoAccount?.gender?.rawValue as Any,
      "isEmailValid": user.kakaoAccount?.isEmailValid as Any,
      "isEmailVerified": user.kakaoAccount?.isEmailVerified as Any
    ]
  }
}
