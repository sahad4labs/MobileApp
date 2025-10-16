package com.callapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.app.Activity;
import android.app.role.RoleManager;





import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Promise;


import java.io.File;

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

    private void sendIncomingEvent(String eventName,String phoneNumber){
        if(reactContext!=null && reactContext.hasActiveCatalystInstance()){
            reactContext
           .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
           .emit(eventName,phoneNumber);
           Log.i(TAG,"Event sented"+phoneNumber);
        }
        else{
            Log.w(TAG, "⚠️ React context not active, cannot send: " + eventName);
        }

    }

  
private class CallReceiver extends BroadcastReceiver {
    private boolean wasOffhook = false;
    private String lastState = "";
    private boolean isIncoming = false;
    private String incomingNumber = null;
    private long lastEndEventTime = 0;
    private static final long MIN_EVENT_INTERVAL = 2500; 

    @Override
    public void onReceive(Context context, Intent intent) {
        String stateStr = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
        if (stateStr == null) return;

       
        if (stateStr.equals(lastState)) return;
        lastState = stateStr;

        Log.i(TAG, "onReceive state=" + stateStr);

        if (TelephonyManager.EXTRA_STATE_RINGING.equals(stateStr)) {
            incomingNumber = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER);
            if (incomingNumber == null) incomingNumber = "Unknown";
            isIncoming = true;
            Log.i(TAG, "📲 Incoming call from: " + incomingNumber);

        } else if (TelephonyManager.EXTRA_STATE_OFFHOOK.equals(stateStr)) {
            wasOffhook = true;

        } else if (TelephonyManager.EXTRA_STATE_IDLE.equals(stateStr)) {
            if (!wasOffhook) return; 

                long now = System.currentTimeMillis();
                if (now - lastEndEventTime < MIN_EVENT_INTERVAL) {
                    Log.i(TAG, "⚠️ Skipping duplicate CallEnded event");
                    return;
                }
                lastEndEventTime = now;

                if (isIncoming) {
                    Log.i(TAG, "📱 Incoming call ended: " + incomingNumber);
                    sendIncomingEvent("CallEndedIncoming", incomingNumber);
                } else {
                    Log.i(TAG, "📞 Outgoing call ended");
                    sendEvent("CallEnded");
                }
                wasOffhook=false;
                isIncoming=false;
                incomingNumber=null;
            }
        }
    }
}




