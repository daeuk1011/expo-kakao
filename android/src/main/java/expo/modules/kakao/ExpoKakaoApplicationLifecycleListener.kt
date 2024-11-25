import com.kakao.sdk.common.KakaoSdk
import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener
import android.util.Log

class ExpoKakaoApplicationLifecycleListener : ApplicationLifecycleListener {

    override fun onCreate(application: Application) {
        try {
            // Retrieve the app key from resources
            val appKeyResId = application.resources.getIdentifier(
                "nativeAppKey", "string", application.packageName
            )

            if (appKeyResId != 0) {
                val appKey = application.getString(appKeyResId)

                if (appKey.isNotEmpty()) {
                    // Initialize Kakao SDK
                    KakaoSdk.init(application, appKey)
                    Log.i("ExpoKakao", "Kakao SDK initialized successfully with appKey: $appKey")
                } else {
                    Log.e("ExpoKakao", "Kakao SDK initialization failed: App Key is empty")
                }
            } else {
                Log.e("ExpoKakao", "Kakao SDK initialization failed: App Key resource not found")
            }
        } catch (e: Exception) {
            // Log any exceptions during initialization
            Log.e("ExpoKakao", "Kakao SDK initialization failed: ${e.message}", e)
        }
    }
}
