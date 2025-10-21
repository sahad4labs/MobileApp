package com.callapp

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        RNBootSplash.init(this, R.style.BootTheme)
        super.onCreate(savedInstanceState)
    }

    override fun getMainComponentName(): String = "callApp"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
