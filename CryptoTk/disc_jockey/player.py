import calls
import sys
import time
import json
import ipfsapi
import os

ipfs_api = ipfsapi.connect('127.0.0.1', 5001)

def candidates():
  ' most voted songs '
  most_voted_songs = calls.sort()
  non_zero = []
  for idx in most_voted_songs:
    if calls.upvotes(idx) > 0:
      non_zero.append(idx)
  return non_zero

while True:
  to_play = candidates()
  if len(to_play) == 0:
    print('No song to play! upvote one', file=sys.stderr)
    time.sleep(10)
    continue
  calls.songPlayed(int(to_play[0]))
  idx = to_play[0]
  print('Going to play song # {}'.format(idx))
  js = json.loads(ipfs_api.cat(calls.get_uri(idx)))
  print(js)
  mp3 = ipfs_api.cat(js['location'])
  open('/tmp/mp3.mp3', 'bw').write(mp3)
  # Leet :-P
  os.system('mpg123 /tmp/mp3.mp3')
