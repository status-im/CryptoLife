' Network wrapper module for web3 '

import os
import web3

WEB3 = web3.Web3(web3.HTTPProvider(os.getenv('WEB3_PROVIDER_URI')))
assert WEB3.isConnected()

def contract(address, abi):
    '  Get a contract by adress '
    ret =WEB3.eth.contract(address=address, abi=abi)
    return ret

def to_checksum(addr):
  ' To checksum addess - we should not do this but this is a hackaton - user should do it '
  return WEB3.toChecksumAddress(addr)

def main():
    ' main func - just connection test '
    print(os.getenv('WEB3_PROVIDER_URI'))
    assert WEB3.isConnected()

if __name__ == "__main__":
    main()
