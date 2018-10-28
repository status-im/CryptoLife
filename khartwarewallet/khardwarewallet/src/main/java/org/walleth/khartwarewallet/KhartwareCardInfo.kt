package org.walleth.khartwarewallet

import org.kethereum.crypto.model.PublicKey

data class KhartwareCardInfo(
    val instanceUID: String,
    val pubKey : PublicKey,
    val version : KhartwareVardVersion,
    val remainingPairingSlots: Int,
    val keyUID: String
)