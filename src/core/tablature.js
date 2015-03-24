import _ from 'underscore';

import {
  Note,
  Rest,
  par,
  seq
} from './score';

import {
	pitches
} from './pitch';

import {
	Duration,
  sixteenth as baseDuration
} from './duration';

// Pitch
const basePitch = pitches.e3;

// Score
const empty = new Rest(new Duration(0));

// String -> Score
export function parse(str) {
	let lines = _.chain(str.split(/[\r\n]/g))
		.map(trimComments)
		.filter(line => !!line)
		.value();

	return parseLines(lines);
}

// String -> Or(String Null)
function trimComments(str) {
	let index = str.indexOf('#');
  let line  = (index < 0) ? str.trim() : str.substring(0, index).trim();
  return (line == "") ? null : line;
}

// ArrayOf(String) -> Score
function parseLines(lines) {
	console.log('parseLines', lines);
	
	if(lines.length >= 6) {
		let [ highE, b, g, d, a, lowE, ...rest ] = lines;
		return seq(
			par(
				parseLine(highE, 24),
	      parseLine(b,     19),
	      parseLine(g,     15),
	      parseLine(d,     10),
	      parseLine(a,      5),
	      parseLine(lowE,   0)
			),
			parseLines(rest)
		);
	} else {
		return new Rest(new Duration(0));
	}
}

// String Number -> Score
function parseLine(line, openNote) {
	console.log('parseLine', line, openNote);

	var accum = new StringAccum();

	while(line.length > 0) {
		if(/^\d+/.test(line)) {
			let [ _, fret, rest ] = line.match(/^(\d{1,2})(.*)$/i);
			line  = rest;
			accum = accum.completeNote().startNote(openNote + parseInt(fret, 10));
		} else if(/^[| ]/.test(line)) {
			line  = line.substring(1);
		} else {
			line  = line.substring(1);
			accum = accum.extendNote();
		}
	}

	return accum.completeNote().score;
}

class StringAccum {
	// Or(Pitch Null) Number Score -> StringAccum
	constructor(pitch = null, length = 0, score = empty) {
		this.pitch  = pitch;
		this.length = length;
		this.score  = score;
	}

	// Number -> StringAccum
  startNote(offset) {
    return new StringAccum(basePitch.transpose(offset), 1, this.score);
  }

	// -> StringAccum
  extendNote() {
    return new StringAccum(this.pitch, this.length + 1, this.score);
  }

  // -> StringAccum
  completeNote() {
    if(this.length == 0) {
    	return new StringAccum(null, 0, this.score);
    } else if(this.pitch) {
    	let note = new Note(this.pitch, baseDuration.multiply(this.length));
      return new StringAccum(null, 0, seq(this.score, note));
    } else {
    	let rest = new Rest(baseDuration.multiply(this.length));
    	return new StringAccum(null, 0, seq(this.score, rest));
    }
  }
}
