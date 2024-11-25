package expo.modules.kakao

import ExpoKakaoApplicationLifecycleListener
import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package

class ExpoKakaoPackage : Package {
  override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> {
    return listOf(ExpoKakaoApplicationLifecycleListener())
  }
}