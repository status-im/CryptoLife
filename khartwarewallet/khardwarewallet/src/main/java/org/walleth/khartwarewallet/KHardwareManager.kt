package org.walleth.khartwarewallet

import android.content.ContentValues.TAG
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.TagLostException
import android.nfc.tech.IsoDep
import android.os.SystemClock
import android.util.Log
import im.status.hardwallet_lite_android.io.CardChannel
import java.io.IOException
import java.security.Security

private const val TAG = "CardManager"

class KHardwareManager : Thread(), NfcAdapter.ReaderCallback {

    private var isoDep: IsoDep? = null
    private var isInvokingListener: Boolean = false

    var onCardConnectedListener: ((channel: KhartwareChannel) -> Unit)? = null

    fun isConnected() = isoDep != null && isoDep!!.isConnected

    init {
        Security.insertProviderAt(org.spongycastle.jce.provider.BouncyCastleProvider(), 1)
    }

    override fun onTagDiscovered(tag: Tag) {
        isoDep = IsoDep.get(tag)

        try {
            isoDep = IsoDep.get(tag)
            isoDep!!.connect()
            isoDep!!.timeout = 120000
        } catch (e: IOException) {
            Log.e(TAG, "error connecting to tag")
        }

    }

    override fun run() {
        var connected = isConnected()

        while (true) {
            val newConnected = isConnected()
            if (newConnected != connected) {
                connected = newConnected
                Log.i(TAG, "tag " + if (connected) "connected" else "disconnected")

                if (connected && !isInvokingListener) {
                    onCardConnected()
                } else {
                    onCardDisconnected()
                }
            }

            SystemClock.sleep(50)
        }
    }

    private fun onCardConnected() {
        isInvokingListener = true

        try {
            val channel = KhartwareChannel(CardChannel(isoDep))

            val supportedVersion = KhartwareVardVersion(1, 2)
            if (channel.cardInfo.version != supportedVersion) {
                throw(IllegalStateException("Card version not supported. is:" + channel.cardInfo.version + " expected: " + supportedVersion))
            }
            onCardConnectedListener?.invoke(channel)

        } catch (ioe: IOException) {
            ioe.printStackTrace()
        } catch (ignored: TagLostException) {
        } // this can happen - not a big deal

        isInvokingListener = false
    }

    private fun onCardDisconnected() {
        isInvokingListener = false
        isoDep = null
    }

}
