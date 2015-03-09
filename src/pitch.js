var names = [ "c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b" ];

export class Pitch {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  freq(transpose = 0) {
    return Math.pow(2, (this.value + transpose) / 12.0) * 440.0
  }
}

export var pitches = {};

export function parse(str) {
  return pitches[str.toLowerCase()];
}

for(let octave = 0; octave <= 7; octave++) {
  for(let offset = 0; offset < names.length; offset++) {
    let name  = names[offset] + octave;
    let value = (12 * octave + offset) - (12 * 4 + 9);
    pitches[name] = new Pitch(name, value);
  }
}
