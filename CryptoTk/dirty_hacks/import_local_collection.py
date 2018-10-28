# Quick hack for initial import of public domain mp3 files.

import eyed3
import glob
import ipfsapi
import random
import ujson

ipfs_api = ipfsapi.connect('127.0.0.1', 5001)
output = open('list.txt', 'w')
good_songs = 0
songs = glob.glob('*.mp3')
random.shuffle(songs)
for song_name in songs:
    try:
       audio = eyed3.load(song_name)
    except:
       continue
    if audio.tag.title is not None and audio.tag.album_artist is not None and audio.tag.album is not None and audio.info.time_secs > 30:
       song_bytes = open(song_name, 'br').read()
       result = ipfs_api.add_bytes(song_bytes)
       out_dict = {'title' : audio.tag.title,
                   'artist' : audio.tag.album_artist,
                   'album' : audio.tag.album,
                   'location' : result,
                   'time_secs' : audio.info.time_secs,
                   'size_bytes' : audio.info.size_bytes}
       print(out_dict)
       result = ipfs_api.add_json(out_dict)
       print(result, file=output)
       good_songs += 1
       print(good_songs)
