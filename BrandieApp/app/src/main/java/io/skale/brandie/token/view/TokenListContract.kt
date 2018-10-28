package io.skale.brandie.token.view

import io.skale.brandie.model.SeedPack
import io.skale.brandie.model.Token


interface TokenListContract {

    fun onGetTokenSuccess(tokens: ArrayList<Token>)
    fun onGetTokenError()

    fun onGetSeedPackSuccess(packs: ArrayList<SeedPack>)
    fun onGetSeedPackError()

}