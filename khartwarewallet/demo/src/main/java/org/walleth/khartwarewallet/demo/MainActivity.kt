package org.walleth.khartwarewallet.demo

import android.graphics.drawable.BitmapDrawable
import android.nfc.NfcAdapter.getDefaultAdapter
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.text.Html
import android.text.method.LinkMovementMethod
import android.view.View
import android.widget.ImageView
import kotlinx.android.synthetic.main.activity_main.*
import net.glxn.qrgen.android.QRCode
import org.kethereum.DEFAULT_GAS_LIMIT
import org.kethereum.DEFAULT_GAS_PRICE
import org.kethereum.bip39.wordlists.WORDLIST_ENGLISH
import org.kethereum.crypto.toAddress
import org.kethereum.functions.encodeRLP
import org.kethereum.model.Address
import org.kethereum.model.ChainDefinition
import org.kethereum.model.Transaction
import org.walleth.khartwarewallet.KHardwareManager
import org.walleth.khartwarewallet.enableKhardwareReader
import org.walleth.khex.toHexString
import java.io.PrintWriter
import java.io.StringWriter
import java.math.BigInteger.ZERO
import java.math.BigInteger.valueOf

const val TAG = "MainActivity"

class MainActivity : AppCompatActivity() {

    private val nfcAdapter by lazy {
        getDefaultAdapter(this)
    }

    private val cardManager by lazy { KHardwareManager() }

    private var currentInfoText: String? = null
        set(value) {
            field = value
            runOnUiThread {
                info_text.text = Html.fromHtml(field)
                info_text.movementMethod = LinkMovementMethod()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        cardManager.onCardConnectedListener = { channel ->

            try {
                currentInfoText = "Card detected " + channel.cardInfo

                channel.autoPair("WalletAppletTest")
                currentInfoText += "\nCard paired"

                channel.autoOpenSecureChannel()
                currentInfoText += "\nSecure channel established"

                when (mode_radio_group.checkedRadioButtonId) {
                    R.id.mode_radio_check_status -> {

                        val status = channel.getStatus().toString()

                        currentInfoText += "\nCard status $status"

                        channel.verifyPIN("000000")
                    }

                    R.id.mode_radio_show_qr_code -> {
                        channel.verifyPIN("000000")

                        val address = channel.toPublicKey().toAddress()

                        currentInfoText += "\nCard address $address"

                        runOnUiThread {
                            qrcode_image.setQRCode("ethereum:$address")
                            qrcode_image.visibility = View.VISIBLE
                        }
                    }

                    R.id.mode_radio_check_generate_mnemonic -> {

                        val mnemonic = channel.generateMnemonic(4, WORDLIST_ENGLISH)

                        currentInfoText += "\nGenerated Mnemonic $mnemonic"

                        channel.verifyPIN("000000")
                    }


                    R.id.mode_radio_new_key -> {

                        channel.verifyPIN("000000")

                        channel.initWithNewKey()

                        currentInfoText += "\nNew Key uploaded"
                    }

                    R.id.mode_radio_remove_key -> {

                        channel.verifyPIN("000000")

                        channel.removeKey()

                        currentInfoText += "\nKey removed"

                    }

                    R.id.mode_radio_create_transaction -> {

                        channel.verifyPIN("000000")

                        val address = channel.toPublicKey().toAddress()

                        val tx = Transaction(
                            chain = ChainDefinition(4L),
                            creationEpochSecond = null,
                            from = address,
                            gasLimit = DEFAULT_GAS_LIMIT,
                            gasPrice = DEFAULT_GAS_PRICE,
                            input = emptyList(),
                            nonce = ZERO,
                            to = Address("0x381e247bef0ebc21b6611786c665dd5514dcc31f"),
                            txHash = null,
                            value = valueOf(42L)
                        )

                        val rlp=channel.sign(tx).encodeRLP().toHexString()

                        currentInfoText += "\nSigned transaction <a href='https://api-rinkeby.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=$rlp'>link</a>"

                        currentInfoText += "\n\n from <a href='https://rinkeby.etherscan.io/address/$address'>link</a>"

                    }

                }

                channel.unpairOthers()
                channel.autoUnpair()

            } catch (e: Exception) {
                val sw = StringWriter()
                e.printStackTrace(PrintWriter(sw))
                val exceptionAsString = sw.toString()

                currentInfoText += "\n\nException: " + e.message
                currentInfoText += "\n\nTrace: $exceptionAsString"
            }
        }

        cardManager.start()
    }


    public override fun onResume() {
        super.onResume()
        nfcAdapter?.enableKhardwareReader(this, cardManager)
    }

    public override fun onPause() {
        super.onPause()
        nfcAdapter?.disableReaderMode(this)
    }
}

fun ImageView.setQRCode(content: String) {
    val drawable = BitmapDrawable(resources, QRCode.from(content).bitmap())
    drawable.setAntiAlias(false)
    drawable.isFilterBitmap = false
    setImageDrawable(drawable)
}