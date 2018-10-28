import Tone from 'tone';
import { Synth } from './synth';
const NOTES = ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'];

const POSITIONS = ['0', '0:2', '0:2:2', '0:3', '0:3:0',
  '1', '1:2', '1:2:2', '1:3', '1:3:0',
  '2', '2:2', '2:2:2', '2:3', '2:3:0',
  '3', '3:2', '3:2:2', '3:3', '3:3:0']


export class Pad extends Synth {
  constructor(trackId, params, rng) {
    super('pad', trackId, params, rng);
  }

  buildSteps() {
    const steps = [];
    let count = this.rng.nextInt(0, 3);
    while (count > 0) {
      steps.push({
        time: this.rng.nextArrayItem(POSITIONS),
        note: [
          this.rng.nextArrayItem(NOTES) + this.rng.nextArrayItem(['3', '4']),
          this.rng.nextArrayItem(NOTES) + this.rng.nextArrayItem(['3', '4']),
          this.rng.nextArrayItem(NOTES) + this.rng.nextArrayItem(['3', '4']),
        ],
        duration: '2m',
        ...this.buildStepAttributes(),
      });
      count--;
    }
    return steps;
  }

  buildEffects() {
    this.effects = [
      new Tone.JCReverb(this.params[9]),
      new Tone.Chorus({
        frequency: this.params[10],
        depth: this.params[11],
      }),
      new Tone.Filter({
        type: 'lowpass',
        frequency: Math.floor(600 + 400 * this.params[12])
      }),
      new Tone.Gain(0.015),
    ]
  }

  overrideSynth() {
    const args = [...this.effects, Tone.Master];
    // this.synth = new Tone[this.synthId+"Synth"](DEFAULTS[this.type][this.synthId]);
    this.synth = new Tone.PolySynth(4, Tone[this.synthId + "Synth"])
    if (this.synthId == 'Mono') {
      this.synth.volume.value = -12;
    } else {
      this.synth.volume.value = -10;
    }
    this.synth.chain.apply(this.synth, args);
  }
}