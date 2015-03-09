import { EmptyScore, NoteScore, RestScore, ParScore, SeqScore } from './score';

export class Command {}

export class NoteOn extends Command {
  constructor(pitch) {
    this.pitch = pitch;
  }
}

export class Wait extends Command {
  constructor(duration) {
    this.duration = duration;
  }
}

// score -> arrayOf(command)
export function compile(score) {
  if(score instanceof NoteScore) {
    return [
      new NoteOn(score.pitch),
      new Wait(score.duration)
    ];
  } else if(score instanceof RestScore) {
    return [
      new Wait(score.duration)
    ];
  } else if(score instanceof SeqScore) {
    return compile(score.a).concat(compile(score.b));
  } else if(score instanceof ParScore) {
    return merge(compile(score.a), compile(score.b));
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
