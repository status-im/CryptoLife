' Network wrapper module for web3 '

import ujson
import addr
import network

def main():
    ' main f '

    ctk = network.contract(address=network.to_checksum(addr.NFT_CONTRACT), abi=open('cryptotk.abi').read().strip())
    gasPrice = int(1e9 * 10)

    # Send function

    #x = ctk.functions.voteUp(0)
    x = ctk.encodeABI(fn_name='voteUp', args=[0])
    print(x)
    _to = network.to_checksum(addr.PUB)
    _value = 1
    signed_txn = network.WEB3.eth.account.signTransaction(dict(
        nonce = network.WEB3.eth.getTransactionCount(network.to_checksum(addr.PUB)),
        gasPrice = gasPrice,
        data=x,
        gas = 100000,
        to = network.to_checksum(addr.NFT_CONTRACT),
        #value = _value,
        ), addr.PRIV)
    print(signed_txn)
    tx_hash = network.WEB3.eth.sendRawTransaction(signed_txn.rawTransaction)
    print(tx_hash.hex())
    # Ignoring result.
    network.WEB3.eth.waitForTransactionReceipt(tx_hash)
    return 0

    #dict(
    #    nonce = network.WEB3.eth.getTransactionCount(network.to_checksum(addr.PUB)),
    #    gasPrice = gasPrice,
    #    gas = 25000,
    #    to = _to,
    #    value = _value,
    #    ), addr.PRIV)
    
    # Send to Myself for tests!
    _to = network.to_checksum(addr.PUB)
    _value = 1
    signed_txn = network.WEB3.eth.account.signTransaction(dict(
        nonce = network.WEB3.eth.getTransactionCount(network.to_checksum(addr.PUB)),
        gasPrice = gasPrice,
        gas = 25000,
        to = _to,
        value = _value,
        ), addr.PRIV)
    print(signed_txn)
    tx_hash = network.WEB3.eth.sendRawTransaction(signed_txn.rawTransaction)
    print(tx_hash.hex())
    # Ignoring result.
    network.WEB3.eth.waitForTransactionReceipt(tx_hash)

    #ctk.functions.vote(0).transact({'from': eth.accounts[1], 'gas': 100000})

if __name__ == "__main__":
    main()
