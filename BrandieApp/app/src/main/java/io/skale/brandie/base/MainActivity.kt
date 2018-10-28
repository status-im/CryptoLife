package io.skale.brandie.base

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.support.v7.widget.LinearLayoutManager
import android.support.v7.widget.Toolbar
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.Button
import android.widget.Toast
import com.google.zxing.integration.android.IntentIntegrator
import io.skale.brandie.R
import io.skale.brandie.model.SeedPack
import io.skale.brandie.model.Token
import io.skale.brandie.token.adapter.SeedPackListAdapter
import io.skale.brandie.token.adapter.TokenListAdapter
import io.skale.brandie.token.presenter.TokenListPresenter
import io.skale.brandie.token.view.TokenListContract
import io.skale.brandie.user.ui.SettingsActivity
import kotlinx.android.synthetic.main.activity_main.*
import java.util.*


class MainActivity : BaseActivity(), TokenListContract {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setupToolbar()
        setupList()

        var scan_btn = findViewById(R.id.button) as Button
        val activity = this
        scan_btn.setOnClickListener(View.OnClickListener {
            val integrator = IntentIntegrator(activity)
            integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE_TYPES)
            integrator.setPrompt("Scan")
            integrator.setCameraId(0)
            integrator.setBeepEnabled(false)
            integrator.setBarcodeImageEnabled(false)
            integrator.initiateScan()
            integrator.setCaptureActivity(CaptureActivityPortrait::class.java)
        })
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        val result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data)
        if (result != null) {
            if (result.contents == null) {
                Toast.makeText(this, "You cancelled the scanning", Toast.LENGTH_LONG).show()
            } else {
                Toast.makeText(this, result.contents, Toast.LENGTH_LONG).show()
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data)
        }
    }

    override fun onGetTokenSuccess(tokens: ArrayList<Token>) {
        rv_tokens.adapter = TokenListAdapter(tokens, this)
    }

    override fun onGetTokenError() {
        Log.e("MainActivity", "onGetTokenError")
    }

    override fun onGetSeedPackSuccess(packs: ArrayList<SeedPack>) {
        //rv_seed_tokens.adapter = SeedPackListAdapter(packs, this)
    }

    override fun onGetSeedPackError() {
        Log.e("MainActivity", "onGetSeedPackError")
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_activity_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        val id = item.itemId
        if (id == R.id.action) {
            Toast.makeText(this@MainActivity, "Brandie", Toast.LENGTH_LONG).show()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    private fun setupToolbar() {
        val myToolbar = findViewById<View>(R.id.toolbar) as Toolbar
        setSupportActionBar(myToolbar)
        myToolbar.setNavigationIcon(R.drawable.ic_person)
        myToolbar.setNavigationOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }
    }

    private fun setupList() {
        rv_tokens.layoutManager = LinearLayoutManager(this)
        //rv_seed_tokens.layoutManager = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        val tokenListPresenter = TokenListPresenter(this)
        tokenListPresenter.getTokens()
        tokenListPresenter.getSeedTokens()
    }
}
