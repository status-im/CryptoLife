export const INTERVALS = {
  kick: {
    Membrane: {
      pitchDecay: [0, 0.1],
      "envelope.attack": [0.001, 0.2],
      "envelope.decay": [0.05, 0.3],
      "envelope.release": [0.1, 0.2],
    }
  },
  pad: {
    FM: {
      "envelope.attack": [0.001, 0.2],
      "envelope.decay": [0.05, 0.3],
      "envelope.release": [0.1, 0.2],
    },
    Mono: {
      "envelope.attack": [0.001, 0.2],
      "envelope.decay": [0.05, 0.3],
      "envelope.release": [0.1, 0.2],
    }
  },
  hat: {
    Metal: {
      "envelope.decay": [0.1, 0.4],
      "frequency.value": [100, 300],
      "harmonicity": [0, 10],
      "resonance": [0, 6000],
    }
  },
  perc: {
    Membrane: {
      pitchDecay: [0, 0.05],
      "envelope.attack": [0.001, 0.2],
      "envelope.decay": [0.05, 0.3],
      "envelope.release": [0.1, 0.2],
    },
    Pluck: {
      attackNoise: [0, 2],
      "dampening.value": [600, 2000],
      "resonance.value": [0, 2],
    },
  }
}

export const DEFAULTS = {
  kick: {
    Membrane: {
      oscillator: {
        type: 'sine'
      },
      envelope: {
        sustain: 0.01
      }
    }
  },
  pad: {
    FM: {},
    Mono: {
      oscillator: {
        type: 'sawtooth'
      },
    }
  },
  hat: {
    Metal: {
    }
  },
  perc: {
    Pluck: {},
    Membrane: {
      oscillator: {
        type: 'square',
      },
    }
  }

}

export const LOOP_LENGTHS = {
  kick: [1, 2, 4],
  pad: [4],
  hat: [1, 2],
  perc: [1, 2, 3, 4],
}
