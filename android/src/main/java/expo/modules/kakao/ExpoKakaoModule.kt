package expo.modules.kakao

import android.content.Context
import expo.modules.core.errors.ModuleNotFoundException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.kakao.sdk.common.KakaoSdk
import com.kakao.sdk.common.util.Utility
import com.kakao.sdk.user.UserApiClient
import com.kakao.sdk.auth.model.Prompt
import com.kakao.sdk.user.model.User
import com.kakao.sdk.auth.model.OAuthToken
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import java.util.Date
import expo.modules.kotlin.Promise


class ExpoKakaoModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoKakao")

        Constants(
            "PI" to Math.PI
        )

        Function("initializeKakaoSDK") { appKey: String, options: Map<String, Any?> ->
            val context = getValidContext()
            KakaoSdk.init(context, appKey)
            println("Kakao SDK initialized with appKey: $appKey")
        }

        AsyncFunction("isKakaoTalkLoginAvailable") {
            val context = getValidContext()
            UserApiClient.instance.isKakaoTalkLoginAvailable(context)
        }

        Function("getKeyHashAndroid") { ->
            val context = getValidContext()
            Utility.getKeyHash(context)
        }

        AsyncFunction("login") { 
            options: Map<String, Any?>,
            promise: Promise ->

            val serviceTerms = options["serviceTerms"] as? List<String>
            val prompts = options["prompts"] as? List<String>
            val useKakaoAccountLogin = options["useKakaoAccountLogin"] as? Boolean ?: false
            val scopes = options["scopes"] as? List<String>

            val context = appContext.currentActivity
                ?: run {
                    promise.reject("LOGIN_ERROR", "Current activity is not available", null)
                    return@AsyncFunction
                }

            val callback: (OAuthToken?, Throwable?) -> Unit = { token, error ->
                if (error != null) {
                    promise.reject("LOGIN_ERROR", error.message, error)
                } else if (token == null) {
                    promise.reject("LOGIN_ERROR", "Login failed: No token received", null)
                } else {
                    promise.resolve(tokenToMap(token))
                }
            }


            // Kakao SDK의 로그인 방식 선택
            when {
                scopes?.isNotEmpty() == true -> {
                    UserApiClient.instance.loginWithNewScopes(context, scopes, callback = callback)
                }

                UserApiClient.instance.isKakaoTalkLoginAvailable(context) && !useKakaoAccountLogin -> {
                    UserApiClient.instance.loginWithKakaoTalk(
                        context,
                        serviceTerms = serviceTerms,
                        callback = callback
                    )
                }

                else -> {
                    UserApiClient.instance.loginWithKakaoAccount(
                        context,
                        convertPrompts(prompts),
                        serviceTerms = serviceTerms,
                        callback = callback
                    )
                }
            }
        }

        AsyncFunction("me") { promise: Promise ->
            val context = getValidContext()

            UserApiClient.instance.me { user, error ->
                if (error != null) {
                    // Ensure all required parameters are passed
                    promise.reject("USER_INFO_ERROR", error.message ?: "An error occurred", error)
                } else if (user == null) {
                    promise.reject("USER_INFO_ERROR", "Failed to fetch user info", null)
                } else {
                    promise.resolve(userToMap(user))
                }
            }
        }
    }

    private fun tokenToMap(token: OAuthToken): Map<String, Any> {
        return mapOf(
            "accessToken" to (token.accessToken ?: ""),
            "refreshToken" to (token.refreshToken ?: ""),
            "tokenType" to "",
            "idToken" to (token.idToken ?: ""),
            "accessTokenExpiresAt" to token.accessTokenExpiresAt.time.toDouble(),
            "refreshTokenExpiresAt" to token.refreshTokenExpiresAt.time.toDouble(),
            "accessTokenExpiresIn" to ((token.accessTokenExpiresAt.time - Date().time) / 1000).toDouble(),
            "refreshTokenExpiresIn" to ((token.refreshTokenExpiresAt.time - Date().time) / 1000).toDouble(),
            "scopes" to (token.scopes ?: emptyList())
        )
    }

    private fun userToMap(user: User): Map<String, Any?> {
        return mapOf(
            "id" to (user.id ?: ""),
            "name" to (user.kakaoAccount?.name ?: ""),
            "email" to (user.kakaoAccount?.email ?: ""),
            "nickname" to (user.kakaoAccount?.profile?.nickname ?: ""),
            "profileImageUrl" to (user.kakaoAccount?.profile?.profileImageUrl ?: ""),
            "thumbnailImageUrl" to (user.kakaoAccount?.profile?.thumbnailImageUrl ?: ""),
            "phoneNumber" to (user.kakaoAccount?.phoneNumber ?: ""),
            "ageRange" to (user.kakaoAccount?.ageRange?.name ?: ""),
            "birthday" to (user.kakaoAccount?.birthday ?: ""),
            "birthdayType" to (user.kakaoAccount?.birthdayType?.name ?: ""),
            "birthyear" to (user.kakaoAccount?.birthyear ?: ""),
            "gender" to (user.kakaoAccount?.gender?.name ?: ""),
            "isEmailValid" to (user.kakaoAccount?.isEmailValid ?: false),
            "isEmailVerified" to (user.kakaoAccount?.isEmailVerified ?: false)
        )
    }

    private fun convertPrompts(prompts: List<String>?): List<Prompt>? {
        return prompts?.mapNotNull {
            when (it.lowercase()) {
                "login" -> Prompt.LOGIN
                "create" -> Prompt.CREATE
                "cert" -> Prompt.CERT
                "unifydaum" -> Prompt.UNIFY_DAUM
                "selectaccount" -> Prompt.SELECT_ACCOUNT
                else -> null
            }
        }
    }

    private fun getValidContext(): Context {
        return appContext.reactContext
            ?: throw IllegalStateException("ReactContext is not available")
    }

}
