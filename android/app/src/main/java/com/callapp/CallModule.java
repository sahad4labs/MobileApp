package com.callapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.telephony.TelephonyManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class CallModule extends ReactContextBaseJavaModule {

    private static final String TAG = "CallModule";
    private final ReactApplicationContext reactContext;
    private CallReceiver callReceiver;

    public CallModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "CallModule";
    }

    @ReactMethod
    public void startCallListener() {
        if (callReceiver == null) {
            callReceiver = new CallReceiver();
            IntentFilter filter = new IntentFilter();
            filter.addAction("android.intent.action.PHONE_STATE");
            reactContext.registerReceiver(callReceiver, filter);
            Log.i(TAG, "Call listener started");
        }
    }

    @ReactMethod
    public void stopCallListener() {
        if (callReceiver != null) {
            try {
                reactContext.unregisterReceiver(callReceiver);
            } catch (Exception e) {
                Log.w(TAG, "Receiver already unregistered");
            }
            callReceiver = null;
            Log.i(TAG, "Call listener stopped");
        }
    }

    private void sendEvent(String eventName) {
    if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, null);
        Log.i(TAG, "✅ Event sent to JS: " + eventName);
    } else {
        Log.w(TAG, "⚠️ React context not active, cannot send: " + eventName);
    }
}


  
    private class CallReceiver extends BroadcastReceiver {
        private boolean wasOffhook = false;

        @Override
        public void onReceive(Context context, Intent intent) {
            String stateStr = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
            Log.i(TAG, "onReceive state=" + stateStr);
            if (stateStr == null) return;

            if (TelephonyManager.EXTRA_STATE_OFFHOOK.equals(stateStr)) {
                wasOffhook = true;
            } else if (TelephonyManager.EXTRA_STATE_IDLE.equals(stateStr)) {
                if (wasOffhook) {
                    wasOffhook = false;
                    Log.i(TAG, "Call ended");
                    sendEvent("CallEnded");
                }
            }
        }
    }
}
