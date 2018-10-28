package org.walleth.khartwarewallet

/**
 * @see https://github.com/status-im/hardware-wallet/blob/master/APPLICATION.MD#get-status
 */
data class KhartwareStatus(
    val pinRetryCount: Int,
    val pukRetryCount: Int,
    val isKeyInitialized: Boolean,
    val isKeyDerivationSupported: Boolean
)