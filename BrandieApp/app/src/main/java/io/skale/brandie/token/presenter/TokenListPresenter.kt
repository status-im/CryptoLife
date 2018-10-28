package io.skale.brandie.token.presenter

import io.skale.brandie.token.view.TokenListContract
import io.skale.brandie.util.Utils

class TokenListPresenter (private val contract : TokenListContract) {

    private val TAG = TokenListPresenter::class.java!!.simpleName

    fun getTokens() {

//        val db = FirebaseFirestore.getInstance()
//        val docRef = db.collection("article").document()
//        docRef.get().addOnCompleteListener { task ->
//            if (task.isSuccessful) {
//                val document = task.result
//                if (document.exists()) {
//                    Log.d(TAG, "DocumentSnapshot data: " + document!!)
//                    val article = document.toObject(Token::class.java)
//                    val arraylist = ArrayList<Token>()
//                    arraylist.add(article!!)
                   contract?.onGetTokenSuccess(Utils.generateTokensMock())
//                } else {
//                    Log.d(TAG, "No such document")
//                    contract?.onGetTokenError()
//                }
//            } else {
//                Log.d(TAG, "get failed with ", task.exception)
//                contract?.onGetTokenError()
//            }
//        }
    }

    fun getSeedTokens() {
        contract?.onGetSeedPackSuccess(Utils.generateSeedPacksMock())
    }

}
