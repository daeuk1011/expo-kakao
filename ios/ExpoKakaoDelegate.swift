import ExpoModulesCore
import KakaoSDKCommon
import KakaoSDKAuth


public class ExpoKakaoDelegate: ExpoAppDelegateSubscriber {
  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    // Kakao SDK 디버깅 로그 활성화

    // Kakao SDK 초기화
    if let appKey = Bundle.main.object(forInfoDictionaryKey: "KAKAO_APP_KEY") as? String {
      KakaoSDK.initSDK(appKey: appKey)
      print("Kakao SDK initialized with appKey: \(appKey)")
    } else {
      print("Kakao SDK initialization failed: KAKAO_APP_KEY is missing in Info.plist")
    }
    return true
  }

  public func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    if AuthApi.isKakaoTalkLoginUrl(url) {
      return AuthController.handleOpenUrl(url: url)
    }
    return false
  }
}
