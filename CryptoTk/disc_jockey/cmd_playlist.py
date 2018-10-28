# Not used!

import calls
import ipfsapi

txt = ipfs_api.cat('Qma97sXAzMU6WbEhXbdouERL8TTjBkJnrrbUErLAjC8Wrh')

def get_media_uris():
  ' get the hashes '
  ntokens = calls.get_ntokens()
  for idx in range(1, calls.get_ntokens() + 1):
    yield calls.get_uri(idx)

for hasht in get_media_uris():
    print('look up in IPFS', hasht)
