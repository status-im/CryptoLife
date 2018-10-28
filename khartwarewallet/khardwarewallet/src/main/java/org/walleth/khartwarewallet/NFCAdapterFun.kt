package org.walleth.khartwarewallet

import android.app.Activity
import android.nfc.NfcAdapter
import android.nfc.NfcAdapter.FLAG_READER_NFC_A
import android.nfc.NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK


fun NfcAdapter.enableKhardwareReader(activity: Activity, manager: KHardwareManager) {
    enableReaderMode(
        activity,
        manager,
        FLAG_READER_NFC_A or FLAG_READER_SKIP_NDEF_CHECK,
        null
    )
}
