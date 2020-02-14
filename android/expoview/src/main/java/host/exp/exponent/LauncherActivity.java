// Copyright 2015-present 650 Industries. All rights reserved.

package host.exp.exponent;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;

import androidx.core.content.ContextCompat;

import host.exp.exponent.experience.HomeActivity;

// This activity is transparent. It uses android:style/Theme.Translucent.NoTitleBar.
// Calls finish() once it is done processing Intent.
public class LauncherActivity extends HomeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    if (host.exp.expoview.BuildConfig.DEBUG) {
      // Need WRITE_EXTERNAL_STORAGE for method tracing
      if (Constants.DEBUG_METHOD_TRACING) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
          if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, 123);
          }
        }
      }
    }

    super.onCreate(savedInstanceState);

    mKernel.handleIntent(this, getIntent());

    // Start a service to keep our process awake. This isn't necessary most of the time, but
    // if the user has "Don't keep activities" on it's possible for the process to exit in between
    // finishing this activity and starting the BaseExperienceActivity.
    startService(ExponentIntentService.getActionStayAwake(getApplicationContext()));

    // Delay to prevent race condition where finish() is called before service starts.
    new Handler(getMainLooper()).postDelayed(() -> {
      try {
        // Crash with NoSuchFieldException instead of hard crashing at task.getTaskInfo().numActivities
        ActivityManager.RecentTaskInfo.class.getDeclaredField("numActivities");

        for (ActivityManager.AppTask task : mKernel.getTasks()) {
          if (task.getTaskInfo().id == getTaskId()) {
            if (task.getTaskInfo().numActivities == 1) {
              finishAndRemoveTask();
              return;
            } else {
              break;
            }
          }
        }
      } catch (Exception e) {
        // just go straight to finish()
      }

      finish();
    }, 100);
  }

  @Override
  @SuppressLint("MissingSuperCall")
  public void onNewIntent(Intent intent) {
    // We shouldn't ever get here, since we call finish() in onCreate. Just want to be safe
    // since this Activity is singleTask and there might be some edge case where this is called.
    mKernel.handleIntent(this, intent);
  }
}
