import { Kick } from './synths/kick';
import { Perc } from './synths/perc';
import { Pad } from './synths/pad';
import { Hat } from './synths/hat';
// import { Kick } from './synths/kick';

const synthConstructor = {
  kick: Kick,
  perc: Perc,
  pad: Pad,
  hat: Hat,
}

export class Track {
  constructor(trackId, { type, enabled, params }, rng) {
    this.id = trackId;
    this.type = type;
    this.enabled = enabled;
    this.rng = rng;
    const Synth = synthConstructor[type];
    if (enabled) {
      this.synth = new Synth(trackId, params, rng);
    }
  }

  dispose() {
    if (this.synth) {
      this.synth.dispose();
    }
  }
}