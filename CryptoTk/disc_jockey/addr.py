import os
PUB=open(os.getenv('PUB_PATH')).read().strip()
PRIV=open(os.getenv('PRIV_PATH')).read().strip()
NFT_CONTRACT=os.getenv('NFT_CONTRACT').strip()

def validate():
    ' Check that we could read the keys - Just that '
    assert len(PRIV) == 64
    assert len(PUB) == 42
    assert len(NFT_CONTRACT) == 42

validate()
