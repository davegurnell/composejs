"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

// Or(Score String)... -> Score
exports.seq = seq;

// Or(Score String)... -> Score
exports.par = par;

// Or(Score String) Instrument -> Score
exports.arrange = arrange;

// Or(Score String) Number -> Score
exports.transpose = transpose;

// String -> Score
exports.parse = parse;

var _ = require("underscore")["default"];

var _pitch = require("./pitch");

var parsePitch = _pitch.parse;

var _duration = require("./duration");

var Duration = _duration.Duration;
var thirtySecond = _duration.thirtySecond;
var sixteenth = _duration.sixteenth;
var eighth = _duration.eighth;
var quarter = _duration.quarter;
var half = _duration.half;
var whole = _duration.whole;
var parseDuration = _duration.parse;

var _scoreAst = require("./score-ast");

var Score = _scoreAst.Score;
var Note = _scoreAst.Note;
var Rest = _scoreAst.Rest;
var Sequence = _scoreAst.Sequence;
var Parallel = _scoreAst.Parallel;
var Arrangement = _scoreAst.Arrangement;
exports.note = _pitch.pitches;
var rest = {
  // Rest
  t: new Rest(thirtySecond),
  s: new Rest(sixteenth),
  e: new Rest(eighth),
  q: new Rest(quarter),
  h: new Rest(half),
  w: new Rest(whole),

  // String -> Or(Rest Undefined)
  note: function (durationString) {
    switch (durationString) {
      case "t":
        return new Rest(thirtySecond);
      case "s":
        return new Rest(sixteenth);
      case "e":
        return new Rest(eighth);
      case "q":
        return new Rest(quarter);
      case "h":
        return new Rest(half);
      case "w":
        return new Rest(whole);
      default:
        return undefined;
    }
  }
};

exports.rest = rest;
function createExpr(createPair) {
  return function (a) {
    for (var _len = arguments.length, b = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      b[_key - 1] = arguments[_key];
    }

    return _.reduce(b, createPair, a);
  };
}

var internalSeq = createExpr(function (a, b) {
  return new Sequence(a, b);
});
var internalPar = createExpr(function (a, b) {
  return new Parallel(a, b);
});

// Or(Score String) -> Score
function wrapScore(arg) {
  return typeof arg == "string" ? parse(arg) : arg;
}
function seq() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return internalSeq.apply(this, _.map(args, wrapScore));
}

function par() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return internalPar.apply(this, _.map(args, wrapScore));
}

function arrange(score, instrument) {
  return new Arrangement(wrapScore(score), instrument);
}

function transpose(score, offset) {
  score = wrapScore(score);

  if (score instanceof Note) {
    return new Note(score.pitch.transpose(offset), score.duration);
  } else if (score instanceof Rest) {
    return score;
  } else if (score instanceof Sequence) {
    return new Sequence(transpose(score.a, offset), transpose(score.b, offset));
  } else if (score instanceof Parallel) {
    return new Parallel(transpose(score.a, offset), transpose(score.b, offset));
  } else if (score instanceof Arrangement) {
    return new Arrangement(transpose(score.score, offset), score.instrument);
  } else {
    throw new Error("transpose(): score not recognised: " + score);
  }
}

function parse(str) {
  var strings = str.toLowerCase().split(/[,;\s]+/);
  var scores = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = strings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var curr = _step.value;

      var score = parseOne(curr);
      if (score) scores.push(score);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return internalSeq.apply(this, scores);
}

// String -> Score
function parseOne(str) {
  var noteMatch = str.match(/^([a-g]s?\d)(?:[.]([tseqhw](?:[.][d]{1,3})?))?$/i);
  if (noteMatch) {
    var _noteMatch = _slicedToArray(noteMatch, 3);

    var _2 = _noteMatch[0];
    var pStr = _noteMatch[1];
    var dStr = _noteMatch[2];

    var pitch = parsePitch(pStr);
    var duration = parseDuration(dStr || "e");
    return pitch && duration ? new Note(pitch, duration) : undefined;
  }

  var restMatch = str.match(/^r(?:est)?(?:[.]([tseqhw](?:[.][d]{1,3})?))?$/i);
  if (restMatch) {
    var _restMatch = _slicedToArray(restMatch, 2);

    var _3 = _restMatch[0];
    var dStr = _restMatch[1];

    var duration = parseDuration(dStr || "e");
    return duration ? new Rest(duration) : undefined;
  }

  return undefined;
}