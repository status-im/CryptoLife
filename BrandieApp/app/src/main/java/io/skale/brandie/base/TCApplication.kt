package io.skale.brandie.base

import android.app.Activity
import android.app.Application
import android.os.Build
import android.view.WindowManager
import io.skale.brandie.token.ui.TokenEarnedDialog

class TCApplication : Application() {

    private object Holder {
        val INSTANCE = TCApplication()
    }

    companion object {
        val instance: TCApplication by lazy { Holder.INSTANCE }
    }

    fun showTokenEarnedDialog(context: Activity) {
        val dialog = TokenEarnedDialog(context)
        // Set to TYPE_SYSTEM_ALERT so that the Service can display it
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            dialog.window.setType(WindowManager.LayoutParams.TYPE_TOAST);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            dialog.window.setType(WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY);
        }
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            dialog.window.setType(WindowManager.LayoutParams.TYPE_SYSTEM_ALERT);
        }
        dialog.show()
    }
}
