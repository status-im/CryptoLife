import calls
import sys
import time

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
  print(to_play)
  time.sleep(10)
