package com.callapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;

public class CallReceiver extends BroadcastReceiver {
    private static boolean wasOffhook = false;
    private long callStartTime = 0;

    @Override
    public void onReceive(Context context, Intent intent) {
        String stateStr = intent.getStringExtra(TelephonyManager.EXTRA_STATE);
        if (stateStr == null) return;

        Log.i("CallReceiver", "Call state: " + stateStr);

        if (TelephonyManager.EXTRA_STATE_OFFHOOK.equals(stateStr)) {
            wasOffhook = true;
        } else if (TelephonyManager.EXTRA_STATE_IDLE.equals(stateStr)) {
            if (wasOffhook) {
                wasOffhook = false;
                 callStartTime = System.currentTimeMillis();
                Log.i("CallReceiver", "Call ended");

                File latestFile = getLatestRecording();
                if (latestFile != null) {
                    sendEventToReact(context, latestFile.getAbsolutePath());
                    Log.i("CallReceiver", "Recording path: " + latestFile.getAbsolutePath());
                }
            }
        }
    }

    private File getLatestRecording() {
        String[] possibleDirs = {
            "/storage/emulated/0/Call/Recordings/",
            "/storage/emulated/0/Music/Call Recordings/",
            "/storage/emulated/0/Recorder/",
            "/storage/emulated/0/Download/",
            "/storage/emulated/0/Recordings/Call/"
        };

        File latestFile = null;
        for (String dirPath : possibleDirs) {
            File dir = new File(dirPath);
            if (dir.exists() && dir.isDirectory()) {
                File[] files = dir.listFiles();
                if (files != null && files.length > 0) {
                    for (File f : files) {
                        if (latestFile == null || f.lastModified() > latestFile.lastModified()) {
                            latestFile = f;
                        }
                    }
                }
            }
        }
        return latestFile;
    }

    private void sendEventToReact(Context context, String filePath) {
        if (context.getApplicationContext() instanceof ReactApplicationContext) {
            ReactApplicationContext reactContext = (ReactApplicationContext) context.getApplicationContext();
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("CallRecordingSaved", filePath);
        } else {
            Log.w("CallReceiver", "React context not available");
        }
    }
}
