export class Score {}

export class Note extends Score {
  // Pitch Duration -> Score
  constructor(pitch, duration) {
    this.pitch    = pitch;
    this.duration = duration;
  }

  // Syntax for dotted notes.
  //
  // -> Note
  get d()   { return new Note(this.pitch, this.duration.d);   }
  get dd()  { return new Note(this.pitch, this.duration.dd);  }
  get ddd() { return new Note(this.pitch, this.duration.ddd); }
}

export class Rest extends Score {
  // Duration -> Score
  constructor(duration) {
    this.duration = duration;
  }

  // Syntax for dotted notes.
  //
  // -> Note
  get d()   { return new Rest(this.duration.d);   }
  get dd()  { return new Rest(this.duration.dd);  }
  get ddd() { return new Rest(this.duration.ddd); }
}

export class Sequence extends Score {
  // Score Score -> Score
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

export class Parallel extends Score {
  // Score Score -> Score
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

export class Arrangement extends Score {
  // Score Instrument -> Score
  constructor(score, instrument) {
    this.score      = score;
    this.instrument = instrument;
  }
}
