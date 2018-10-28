import calls
import time

file_name = 'data/ipfs_song_list_for_non_fungible_tokens.txt'
for idx, hash_txt in enumerate([x.strip() for x in open(file_name).readlines()]):
  tx_hash = calls.add_media(hash_txt)
  print()
  print(time.time())
  print('sending {}'.format(hash_txt))
  calls.wait_for_tx(tx_hash)
