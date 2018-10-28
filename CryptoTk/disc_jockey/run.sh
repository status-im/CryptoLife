# Run dj.

export PUB_PATH=$HOME/git/pub.txt
export PRIV_PATH=$HOME/git/priv.txt # Dat security :-P
export NFT_CONTRACT=0xaa3f7043a1d1f59fb2e0f9c62ed682e0450308b1
export PY3_TO_USE=$HOME/git/dj/bin/python3
export WEB3_PROVIDER_URI=https://dai.poa.network/
$PY3_TO_USE $@
