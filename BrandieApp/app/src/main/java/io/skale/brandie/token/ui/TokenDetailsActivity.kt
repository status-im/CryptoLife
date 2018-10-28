package io.skale.brandie.token.ui

import android.os.Bundle
import android.view.WindowManager
import com.bumptech.glide.Glide
import io.skale.brandie.R
import io.skale.brandie.base.BaseActivity
import io.skale.brandie.model.Token
import kotlinx.android.synthetic.main.activity_token_details.*

class TokenDetailsActivity : BaseActivity() {

    companion object {
        const val TOKEN_PARCELABLE = "TOKEN_PARCELABLE"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_token_details)
        setupUI()
        window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN)
    }

    private fun setupUI() {
        val token = intent.getParcelableExtra<Token>(TOKEN_PARCELABLE)

        val drawableResourceId = resources.getIdentifier(token.image, "drawable", packageName);
        Glide.with(this).load(drawableResourceId).into(img_token)

        tv_title.text = token.name
        tv_level.text = token.level
        tv_amount.text = token.amount
    }

}
