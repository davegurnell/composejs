import { default as _ } from 'underscore';
import { parse as parsePitch } from './pitch';
import { parse as parseDuration, default as defaultDuration } from './duration';

export class Score {}

export class EmptyScore extends Score {}

export class NoteScore extends Score {
  constructor(pitch, duration) {
    this.pitch    = pitch;
    this.duration = duration;
  }
}

export class RestScore extends Score {
  constructor(duration) {
    this.duration = duration;
  }
}

export class SeqScore extends Score {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

export class ParScore extends Score {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
}

function createExpr(createPair) {
  return (...args) => {
    if(args.length == 0) {
      return empty;
    } else {
      let [ a, ...tail ] = args;
      for(let b of tail) {
        a = createPair(a, b);
      }
      return a
    }
  }
}

function wrapExpr(internalExpr) {
  return (...args) =>
    internalExpr.apply(this, _.map(args, arg =>
      (typeof arg == "string") ? parse(arg) : arg));
}

const empty = new EmptyScore()
const internalPar = createExpr((a, b) => new ParScore(a, b));
const internalSeq = createExpr((a, b) => new SeqScore(a, b));

export const par = wrapExpr(internalPar);
export const seq = wrapExpr(internalSeq);

export function parse(str) {
  let strings = str.toLowerCase().split(/\s+/);
  let scores = [];

  for(let curr of strings) {
    let score = parseOne(curr);
    if(score) scores.push(score);
  }

  return internalSeq.apply(this, scores);
}

function parseOne(str) {
  let noteMatch = str.match(/([a-g][sb]?\d)(?:\/(\d{1,2}))?/i);
  if(noteMatch) {
    let [ _, pStr, dStr ] = noteMatch;
    let pitch    = parsePitch(pStr);
    let duration = dStr ? parseDuration(dStr) : defaultDuration;
    return (pitch && duration) ? new NoteScore(pitch, duration) : undefined;
  }

  let restMatch = str.match(/r(?:est)?(?:\/(\d{1,2}))?/i);
  if(restMatch) {
    let [ _, dStr ] = restMatch;
    let duration = dStr ? parseDuration(dStr) : defaultDuration;
    return duration ? new RestScore(duration) : undefined;
  }

  return undefined;
}

