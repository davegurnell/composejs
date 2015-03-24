import _ from 'underscore';

import { 
  parse as parsePitch
} from './pitch';

import {
  Duration,
  thirtySecond,
  sixteenth,
  eighth,
  quarter,
  half,
  whole,
  parse as parseDuration
} from './duration';

import {
  Score,
  Note,
  Rest,
  Sequence,
  Parallel,
  Arrangement
} from './score-ast';

export {
  pitches as note
} from './pitch';

export const rest = {
  // Rest
  t: new Rest(thirtySecond),
  s: new Rest(sixteenth),
  e: new Rest(eighth),
  q: new Rest(quarter),
  h: new Rest(half),
  w: new Rest(whole),

  // String -> Or(Rest Undefined)
  note: (durationString) => {
    switch(durationString) {
      case 't': return new Rest(thirtySecond);
      case 's': return new Rest(sixteenth);
      case 'e': return new Rest(eighth);
      case 'q': return new Rest(quarter);
      case 'h': return new Rest(half);
      case 'w': return new Rest(whole);
      default: return undefined;
    }
  }
}

function createExpr(createPair) {
  return (a, ...b) => _.reduce(b, createPair, a);
}

const internalSeq = createExpr((a, b) => new Sequence(a, b));
const internalPar = createExpr((a, b) => new Parallel(a, b));

// Or(Score String) -> Score
function wrapScore(arg) {
  return (typeof arg == "string") ? parse(arg) : arg;
}

// Or(Score String)... -> Score
export function seq(...args) {
  return internalSeq.apply(this, _.map(args, wrapScore));
}

// Or(Score String)... -> Score
export function par(...args) {
  return internalPar.apply(this, _.map(args, wrapScore));
}

// Or(Score String) Instrument -> Score
export function arrange(score, instrument) {
  return new Arrangement(wrapScore(score), instrument);
}

// Or(Score String) Number -> Score
export function transpose(score, offset) {
  score = wrapScore(score);

  if(score instanceof Note) {
    return new Note(
      score.pitch.transpose(offset),
      score.duration
    );
  } else if(score instanceof Rest) {
    return score;
  } else if(score instanceof Sequence) {
    return new Sequence(
      transpose(score.a, offset),
      transpose(score.b, offset)
    );
  } else if(score instanceof Parallel) {
    return new Parallel(
      transpose(score.a, offset),
      transpose(score.b, offset)
    );
  } else if(score instanceof Arrangement) {
    return new Arrangement(
      transpose(score.score, offset),
      score.instrument
    );
  } else {
    throw new Error("transpose(): score not recognised: " + score);
  }
}

// String -> Score
export function parse(str) {
  let strings = str.toLowerCase().split(/[,;\s]+/);
  let scores = [];

  for(let curr of strings) {
    let score = parseOne(curr);
    if(score) scores.push(score);
  }

  return internalSeq.apply(this, scores);
}

// String -> Score
function parseOne(str) {
  let noteMatch = str.match(/^([a-g]s?\d)(?:[.]([tseqhw](?:[.][d]{1,3})?))?$/i);
  if(noteMatch) {
    let [ _, pStr, dStr ] = noteMatch;
    let pitch = parsePitch(pStr);
    let duration = parseDuration(dStr || 'e');
    return (pitch && duration) ? new Note(pitch, duration) : undefined;
  }

  let restMatch = str.match(/^r(?:est)?(?:[.]([tseqhw](?:[.][d]{1,3})?))?$/i);
  if(restMatch) {
    let [ _, dStr ] = restMatch;
    let duration = parseDuration(dStr || 'e');
    return duration ? new Rest(duration) : undefined;
  }

  return undefined;
}
