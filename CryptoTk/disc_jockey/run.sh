# Run dj.

export PUB_PATH=$HOME/git/pub.txt
export PRIV_PATH=$HOME/git/priv.txt # Dat security :-P
export NFT_CONTRACT=0x4abdfa122d59333112dee0ace0a7e8c9cea18d6b
export PY3_TO_USE=$HOME/git/dj/bin/python3
export WEB3_PROVIDER_URI=https://dai.poa.network/
$PY3_TO_USE $@
