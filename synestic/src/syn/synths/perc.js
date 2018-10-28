import Tone from 'tone';
import { Synth } from './synth';

const NOTES = ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'];

export class Perc extends Synth {
  constructor(trackId, params, rng) {
    super('perc', trackId, params, rng);
  }

  buildSteps() {
    const steps = [];
    const posibTimes = [];
    for (let m = 0; m < this.loopLength; m++) {
      for (let q = 0; q < 3; q++) {
        for (let s = 0; s < 3; s++) {
          posibTimes.push(`${m}:${q}:${s}`);
        }
      }
    }
    const stepCount = this.rng.nextInt(4, 12);
    for (let i = 0; i < stepCount; i++) {
      steps.push({
        time: this.rng.nextArrayItem(posibTimes),
        note: this.rng.nextArrayItem(NOTES) + this.rng.nextArrayItem(['3', '4']),
        ...this.buildStepAttributes()
      })
    }
    console.log("Perc steps: ", steps);
    return steps;
  }

  buildEffects() {
    const reverb = new Tone.Freeverb(this.params[9] * 0.8, 1000);
    const gain = new Tone.Gain(0.04);
    const crusher = new Tone.BitCrusher(4);
    crusher.wet.value = 0.4 * this.params[10];
    this.effects = [reverb, crusher, gain];
  }
}