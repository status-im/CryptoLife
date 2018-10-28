import Tone from 'tone';
import { Synth } from './synth';

const NOTES = ['B', 'C#', 'F#', 'G'];
const DURATIONS = ['16n'];

export class Hat extends Synth {
  constructor(trackId, params, rng) {
    super('hat', trackId, params, rng);
  }
  buildSteps() {
    const steps = [];
    const posibTimes = ['1t'];
    for (let m = 0; m < this.loopLength; m++) {
      for (let q = 0; q < 3; q++) {
        for (let s = 0; s < 3; s++) {
          posibTimes.push(`${m}:${q}:${s}`);
        }
      }
    }
    const stepCount = this.rng.nextInt(1, 6);
    for (let i = 0; i < stepCount; i++) {
      steps.push({
        time: this.rng.nextArrayItem(posibTimes),
        note: this.rng.nextArrayItem(NOTES) + '5',
        duration: this.rng.nextArrayItem(DURATIONS),
        ...this.buildStepAttributes(),
      })
    }
    console.log("Perc steps: ", steps);
    return steps;
  }

  buildEffects() {
    const reverb = new Tone.Freeverb(this.params[9], 1000);
    const gain = new Tone.Gain(0.05);
    this.effects = [reverb, gain];
  }
}