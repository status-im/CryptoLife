' Network wrapper module for web3 '

import ujson
import addr
import network

GAS_PRICE = int(1e9 * 10) # Do not hardcode. x-DAI is still cheap anyway.

def get_nft():
    return network.contract(address=network.to_checksum(addr.NFT_CONTRACT), abi=open('cryptotk.abi').read().strip())

def wait_for_tx(tx_hash):
    ' Wait for tx '
    return network.WEB3.eth.waitForTransactionReceipt(tx_hash)

def single_arg(method, arg, nonce_inc):
    ' make calls to the contract with a single arg - what we need for now - hackaton style '
    data_to_encode = get_nft().encodeABI(fn_name=method, args=[arg])
    signed_txn = network.WEB3.eth.account.signTransaction(dict(
        nonce = network.WEB3.eth.getTransactionCount(network.to_checksum(addr.PUB)) + nonce_inc,
        gasPrice = GAS_PRICE,
        data=data_to_encode,
        gas = 100000,
        to = network.to_checksum(addr.NFT_CONTRACT),
        ), addr.PRIV)
    tx_hash = network.WEB3.eth.sendRawTransaction(signed_txn.rawTransaction)
    return tx_hash

def vote(method, media_id, nonce_inc=0):
    ' upvote. method=voteUp or voteDown. '
    return single_arg(method, media_id, nonce_inc)

def add_media(method, nft_uri, nonce_inc=0):
    ' register new file '
    return single_arg(method, nft_uri, nonce_inc)

def send_xdai(dest, amount_wei, nonce_inc=0):
    ' Send xdai away '
    signed_txn = network.WEB3.eth.account.signTransaction(dict(
        nonce = network.WEB3.eth.getTransactionCount(network.to_checksum(addr.PUB)),
        gasPrice = gasPrice,
        gas = 25000,
        to = network.to_checksum(dest),
        value = amount_wei,
        ), addr.PRIV)
    return network.WEB3.eth.sendRawTransaction(signed_txn.rawTransaction)

def test_vote():
  ' send a vote '
  print(wait_for_tx(vote('voteUp', 0)))

def main():
  ' main '
  test_vote() # OK

if __name__ == "__main__":
    main()
