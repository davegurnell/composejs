"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _toArray = function (arr) { return Array.isArray(arr) ? arr : Array.from(arr); };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// String -> Score
exports.parse = parse;

var _ = require("underscore")["default"];

var _score = require("./score");

var Note = _score.Note;
var Rest = _score.Rest;
var par = _score.par;
var seq = _score.seq;

var pitches = require("./pitch").pitches;

var _duration = require("./duration");

var Duration = _duration.Duration;
var baseDuration = _duration.sixteenth;

// Pitch
var basePitch = pitches.e3;

// Score
var empty = new Rest(new Duration(0));
function parse(str) {
	var lines = _.chain(str.split(/[\r\n]/g)).map(trimComments).filter(function (line) {
		return !!line;
	}).value();

	return parseLines(lines);
}

// String -> Or(String Null)
function trimComments(str) {
	var index = str.indexOf("#");
	var line = index < 0 ? str.trim() : str.substring(0, index).trim();
	return line == "" ? null : line;
}

// ArrayOf(String) -> Score
function parseLines(lines) {
	console.log("parseLines", lines);

	if (lines.length >= 6) {
		var _lines = _toArray(lines);

		var highE = _lines[0];
		var b = _lines[1];
		var g = _lines[2];
		var d = _lines[3];
		var a = _lines[4];
		var lowE = _lines[5];

		var rest = _lines.slice(6);

		return seq(par(parseLine(highE, 24), parseLine(b, 19), parseLine(g, 15), parseLine(d, 10), parseLine(a, 5), parseLine(lowE, 0)), parseLines(rest));
	} else {
		return new Rest(new Duration(0));
	}
}

// String Number -> Score
function parseLine(line, openNote) {
	console.log("parseLine", line, openNote);

	var accum = new StringAccum();

	while (line.length > 0) {
		if (/^\d+/.test(line)) {
			var _line$match = line.match(/^(\d{1,2})(.*)$/i);

			var _line$match2 = _slicedToArray(_line$match, 3);

			var _2 = _line$match2[0];
			var fret = _line$match2[1];
			var rest = _line$match2[2];

			line = rest;
			accum = accum.completeNote().startNote(openNote + parseInt(fret, 10));
		} else if (/^[| ]/.test(line)) {
			line = line.substring(1);
		} else {
			line = line.substring(1);
			accum = accum.extendNote();
		}
	}

	return accum.completeNote().score;
}

var StringAccum = (function () {
	// Or(Pitch Null) Number Score -> StringAccum

	function StringAccum() {
		var pitch = arguments[0] === undefined ? null : arguments[0];
		var length = arguments[1] === undefined ? 0 : arguments[1];
		var score = arguments[2] === undefined ? empty : arguments[2];

		_classCallCheck(this, StringAccum);

		this.pitch = pitch;
		this.length = length;
		this.score = score;
	}

	_createClass(StringAccum, {
		startNote: {

			// Number -> StringAccum

			value: function startNote(offset) {
				return new StringAccum(basePitch.transpose(offset), 1, this.score);
			}
		},
		extendNote: {

			// -> StringAccum

			value: function extendNote() {
				return new StringAccum(this.pitch, this.length + 1, this.score);
			}
		},
		completeNote: {

			// -> StringAccum

			value: function completeNote() {
				if (this.length == 0) {
					return new StringAccum(null, 0, this.score);
				} else if (this.pitch) {
					var note = new Note(this.pitch, baseDuration.multiply(this.length));
					return new StringAccum(null, 0, seq(this.score, note));
				} else {
					var rest = new Rest(baseDuration.multiply(this.length));
					return new StringAccum(null, 0, seq(this.score, rest));
				}
			}
		}
	});

	return StringAccum;
})();