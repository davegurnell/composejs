import {
  Note,
  Rest, 
  Parallel,
  Sequence,
  Arrangement
} from './score';

export class Command {}

export class NoteOn extends Command {
  constructor(pitch, instrument) {
    this.pitch      = pitch;
    this.instrument = instrument;
  }
}

export class Wait extends Command {
  constructor(duration) {
    this.duration = duration;
  }
}

// score instrument -> arrayOf(command)
export function compile(score, instrument) {
  if(score instanceof Note) {
    return [
      new NoteOn(score.pitch, instrument),
      new Wait(score.duration)
    ];
  } else if(score instanceof Rest) {
    return [
      new Wait(score.duration, instrument)
    ];
  } else if(score instanceof Sequence) {
    return compile(score.a, instrument).concat(compile(score.b, instrument));
  } else if(score instanceof Parallel) {
    return merge(compile(score.a, instrument), compile(score.b, instrument));
  } else if(score instanceof Arrangement) {
    return compile(score.score, score.instrument);
  } else {
    return [];
  }
}

// arrayOf(command) arrayOf(command) -> arrayOf(command)
function merge(a, b) {
  let ans = [];

  while(a.length > 0 && b.length > 0) {
    let [ah, ...at] = a;
    let [bh, ...bt] = b;

    if(ah instanceof NoteOn) {
      ans.push(ah);
      a = at;
    } else if(bh instanceof NoteOn) {
      ans.push(bh);
      b = bt;
    } else if(ah.duration.gt(bh.duration)) {
      ans.push(bh);
      a = [ new Wait(ah.duration.minus(bh.duration)) ].concat(at);
      b = bt;
    } else if(bh.duration.gt(ah.duration)) {
      ans.push(ah);
      a = at;
      b = [ new Wait(bh.duration.minus(ah.duration)) ].concat(bt);
    } else {
      ans.push(ah);
      a = at;
      b = bt;
    }
  }

  return ans.concat(a).concat(b);
}
