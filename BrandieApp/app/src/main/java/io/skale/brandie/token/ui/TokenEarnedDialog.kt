package io.skale.brandie.token.ui

import android.app.Activity
import android.app.Dialog
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.Window
import com.bumptech.glide.Glide
import io.skale.brandie.R
import io.skale.brandie.util.Utils
import kotlinx.android.synthetic.main.dialog_token_earned.*



open class TokenEarnedDialog(private val context: Activity) : Dialog(context) {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        setContentView(R.layout.dialog_token_earned)
        setupUI()
    }

    private fun setupUI() {
        val token = Utils.getRandomToken()
        Glide.with(context).load(token.logo).into(img_token_logo)

        val isFacebookInstalled = Utils.isFacebookInstalled(context.packageManager)
        if (isFacebookInstalled) {
            btn_facebook_sharing.visibility = View.VISIBLE
            btn_facebook_sharing.setOnClickListener {
                share(Utils.FACEBOOK_PACKAGE_NAME)
            }
        }

        val isTwitterInstalled = Utils.isTwitterInstalled(context.packageManager)
        if (isTwitterInstalled) {
            btn_twitter_sharing.visibility = View.VISIBLE
            btn_twitter_sharing.setOnClickListener {
                share(Utils.FACEBOOK_PACKAGE_NAME)
            }
        }

        if (!isTwitterInstalled && !isFacebookInstalled) {
            btn_generic_sharing.visibility = View.VISIBLE
            btn_generic_sharing.setOnClickListener {
                share()
            }
        }

    }

    private fun share(packageName: String = "") {
        val shareIntent = Intent()
        shareIntent.action = Intent.ACTION_SEND
        if (packageName.isNotEmpty())
            shareIntent.setPackage(packageName)
        shareIntent.putExtra(android.content.Intent.EXTRA_TITLE, context.getString(R.string.token_earned_msg))
        shareIntent.putExtra(Intent.EXTRA_TEXT, android.R.attr.description)
        context.startActivity(shareIntent)
    }

}