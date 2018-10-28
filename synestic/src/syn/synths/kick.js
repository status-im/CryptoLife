import Tone from 'tone';
import { Synth } from './synth';

const POSITIONS = [
  '0', '0:2', '0:2:2', '0:3:0', '0:3:2',
  '1', '1:2', '1:2:2', '1:3:0', '1:3:2',
  '2', '2:2', '2:2:2', '2:3:0', '2:3:2',
  '3', '3:2', '3:2:2', '3:3:0', '3:3:2'
]
const NOTES = ['G1', 'E1', 'B1']

export class Kick extends Synth {
  constructor(trackId, params, rng) {
    super('kick', trackId, params, rng);
  }

  buildSteps() {
    const note = this.fromArray(NOTES, this.params[9]);
    const steps = [];
    steps.push({
      time: POSITIONS[0],
      note: note,
      duration: '8n',
      ...this.buildStepAttributes(),
    })
    for (let i = 0; i < 5 * this.loopLength; i++) {
      if (this.rng.nextBoolean()) {
        steps.push({
          time: POSITIONS[i],
          note: note,
          duration: '8n',
          ...this.buildStepAttributes(),
        })
      }
    }
    console.log("Kick steps: ", steps);
    return steps;
  }

  buildEffects() {
    this.effects = [
      new Tone.Filter({
        type: 'lowpass',
        frequency: 300
      }),
      new Tone.Gain(0.4),
    ]
  }
}