import Tone from 'tone';
import { Track } from './track';
import { renderIcon } from './icon';
import Prando from 'prando';

export class Syn {
  constructor({ seed, tracks, bpm, swing, bytes }) {
    this.seed = seed;
    this.bytes = bytes;
    this.rng = new Prando(seed);

    this.tracks = Object.keys(tracks).map((trackId) => new Track(trackId, tracks[trackId], this.rng));
    this.swing = swing;

    Tone.Transport.bpm.value = Math.floor(100 + bpm * 35);
    Tone.Transport.swing = 0.7 * swing;
    Tone.Transport.loopEnd = '4m';
    Tone.Transport.loop = true;
    Tone.Master.chain(new Tone.Compressor());
  }

  dispose() {
    this.tracks.forEach(t => t.dispose())
  }

  icon(target) {
    renderIcon(this, target);
  }
}

export function newSynFromHash(hash) {
  const props = propsFromHash(hash);
  console.log(props);
  return new Syn(props);
}

export function propsFromHash(hash) {
  const bytes = hash.replace("0x", "").match(/.{1,2}/g)
  return {
    hash: hash,
    bytes: bytes,
    seed: bytes.slice(0, 16).join(""),
    bpm: normalizedFloat(bytes[16]),
    swing: normalizedFloat(bytes[17]),
    tracks: {
      kick: {
        type: 'kick',
        enabled: parseInt(bytes[18], 16) & 1,
        params: bytes.slice(19, 29).map(normalizedFloat)
      },
      hat: {
        type: 'hat',
        enabled: parseInt(bytes[18], 16) & 2,
        params: bytes.slice(29, 39).map(normalizedFloat)

      },
      pad: {
        type: 'pad',
        enabled: parseInt(bytes[18], 16) & 4,
        params: bytes.slice(39, 52).map(normalizedFloat),
      },
      perc1: {
        type: 'perc',
        enabled: parseInt(bytes[18], 16) & 8,
        params: bytes.slice(52, 63).map(normalizedFloat),
      },
      perc2: {
        type: 'perc',
        enabled: parseInt(bytes[18], 16) & 16,
        params: bytes.slice(63, 74).map(normalizedFloat),
      }
    }
  }
}

function normalizedFloat(byte) {
  const value = parseInt(byte, 16);
  return value / 256;
}