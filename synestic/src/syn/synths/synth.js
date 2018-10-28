import Tone from 'tone';
import { INTERVALS, DEFAULTS, LOOP_LENGTHS } from './constants';

export class Synth {
  constructor(type, trackId, params, rng) {
    this.type = type;
    this.params = params.map((p) => Math.min(0.99, p))
    this.trackId = trackId;
    this.rng = rng;
    this.effects = {};

    const synths = Object.keys(INTERVALS[this.type]);
    this.synthId = this.fromArray(synths, this.params[0]);

    this.buildIntervals();
    this.buildEffects();
    if (this.overrideSynth) {
      this.overrideSynth();
    } else {
      this.buildSynth();
    }
    this.buildPattern();
  }

  between(start, end) {
    return this.rng.next() * (end - start) + start;
  }

  normalizeTo(value, interval) {
    return interval[0] + value * (interval[1] - interval[0]);
  }

  fromArray(arr, param) {
    return arr[Math.floor(param * (arr.length))];
  }

  buildSynth() {
    const args = [...this.effects, Tone.Master];
    this.synth = new Tone[this.synthId + "Synth"](DEFAULTS[this.type][this.synthId]);
    this.synth.volume.value = -8;
    this.synth.chain.apply(this.synth, args);
  }

  dispose() {
    this.synth.dispose();
    this.pattern.dispose();
    this.effects.forEach(e => e.dispose());
  }

  buildPattern() {
    this.loopLength = this.rng.nextArrayItem(LOOP_LENGTHS[this.type]);
    const synth = this.synth;
    this.pattern = new Tone.Part((time, event) => {
      // console.log(`${this.trackId}-${this.type}:`, event);
      if (this.type == 'pad') {
        let config = {}
        Object.keys(INTERVALS[this.type][this.synthId]).forEach((attr) => {
          let parts = attr.split('.')
          const lastPart = parts.pop();
          const target = parts.reduce((a, p) => {
            a[p] = a[p] || {}
            return a[p];
          }, config);
          target[lastPart] = event[attr];
        })
        this.synth.set(config);
      } else {
        Object.keys(INTERVALS[this.type][this.synthId]).forEach((attr) => {
          let parts = attr.split('.')
          const lastPart = parts.pop();
          const target = parts.reduce((a, p) => a[p], synth);
          target[lastPart] = event[attr];
        })
      }
      if (this.type == 'hat') {
        this.synth.triggerAttackRelease(event.duration, time)
      } else {
        this.synth.triggerAttackRelease(event.note, event.duration, time)
      }
    }, this.buildSteps());

    this.pattern.loop = true;
    this.pattern.loopEnd = this.loopLength + 'm';
    this.pattern.start(0);
  }

  buildIntervals() {
    let attributes = Object.keys(INTERVALS[this.type][this.synthId]);
    this.intervals = attributes.reduce((intervals, attr, index) => {
      intervals[attr] = [
        this.normalizeTo(this.params[1 + index * 2], INTERVALS[this.type][this.synthId][attr]),
        this.normalizeTo(this.params[1 + index * 2 + 1], INTERVALS[this.type][this.synthId][attr]),
      ];
      return intervals;
    }, {})
  }

  buildStepAttributes() {
    let attributes = Object.keys(INTERVALS[this.type][this.synthId]);
    return attributes.reduce((stepAttributes, attr) => {
      stepAttributes[attr] = this.normalizeTo(this.rng.next(), this.intervals[attr]);
      return stepAttributes;
    }, {})
  }
}