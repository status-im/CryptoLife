original repo here: https://github.com/walleth/khardwarewallet

# What?

Kotlin Android library to for the [status.im light hardware wallet](https://hardwallet.status.im) (a java card)

# Where?

get it via jitpack:

[![Release](https://jitpack.io/v/walleth/KHardWareWallet.svg)](https://jitpack.io/#walleth/KHardWareWallet)

# Why?

The workshop about the [status-im hardware wallet](https://hardwallet.status.im) at the first day of [cryptolife](https://hackathon.status.im) inspired me to add support for it to  [WallETH](https://walleth.org) (the Android Ethereum wallet I maintain)

A lot of great use-cases for this came to my mind and inspired me to do the integration:
 - alternative to ether.cards where you do not need scratch off something to enter mnemonic words on your phone - just tap (and even have a hardware wallet for further use afterwards instead of plastic trash which even has a private key printed on it that you might want to keep secret) - these can then also be sold in shops with ether or (e.g. DAI) tokens preloaded and provide great UX for onboarding humans. In volume these cards get dirt cheap and we might get huge amounts of hardware wallets to use for other use cases ..
 - alternative to using WallETH with a TREZOR (e.g. when traveling with a TREZOR you migh get asked questions at borders.) A card could slip through more easily and cause less trouble. Also it is much smaller/lighter/cheaper.  That said the TREZOR still has the advantage of the display - but as an option for different use-cases it is great to have
 - you can do really cool things in the future with it - e.g. when paying with your status-im hardware wallet to rent a room - you could then potentially use this very card to open the room (needs linking from a PIN protected path to a pin-less path) - you might also be able to use this library for the door opening IoT part by using it on an Android things device
 - nicely transfer keys from phone to phone
 - convince iOS users to switch to Android (as these cards do not work on iOS)
 - great option for key-backups (writing down mnemonics which is the most commonly done thing currently for backups has the drawback that it often exposes the key) This way you can just buy a card and even give it to someone untrusted to keep for you.
 - ..


# How?

It is build on top of [hardwallet-lite-android](https://github.com/status-im/hardwallet-lite-android). It is extending this library with functions to directly to parse the results and make it more convenient to use in general.

# Links

  * https://devpost.com/software/khardwarewallet
 * https://github.com/status-im/hardwallet-lite-android/pull/1
 * https://peepeth.com/ligi/peeps/QmavQqt4CtE5xtu8G9yBRnsXzo3KSWisFGKdTG145WMWrT
 * https://github.com/walleth/walleth/pull/295
 * https://github.com/status-im/smartcard-cap-installer-test/pull/5
 * https://hardwallet.status.im

# License

MIT
