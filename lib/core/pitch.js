"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// String -> Or(Pitch, Undefined)
exports.parse = parse;

var Note = require("./score-ast").Note;

var _duration = require("./duration");

var thirtySecond = _duration.thirtySecond;
var sixteenth = _duration.sixteenth;
var eighth = _duration.eighth;
var quarter = _duration.quarter;
var half = _duration.half;
var whole = _duration.whole;

var Pitch = exports.Pitch = (function () {
  // Number Number -> Pitch

  function Pitch(octave, offset) {
    _classCallCheck(this, Pitch);

    this.octave = octave;
    this.offset = offset;
    this.value = 12 * octave + offset - (12 * 4 + 9);
  }

  _createClass(Pitch, {
    t: {

      // -> Note

      get: function () {
        return new Note(this, thirtySecond);
      }
    },
    s: {
      get: function () {
        return new Note(this, sixteenth);
      }
    },
    e: {
      get: function () {
        return new Note(this, eighth);
      }
    },
    q: {
      get: function () {
        return new Note(this, quarter);
      }
    },
    h: {
      get: function () {
        return new Note(this, half);
      }
    },
    w: {
      get: function () {
        return new Note(this, whole);
      }
    },
    transpose: {

      // Number -> Pitch

      value: function transpose(offset) {
        return new Pitch(this.octave, this.offset + offset);
      }
    }
  });

  return Pitch;
})();

function parse(str) {
  str = str.toLowerCase();
  return pitches[str];
}

// There are shorter ways of writing this
// but this is the clearest!

var pitches = {
  c0: new Pitch(0, 0),
  cs0: new Pitch(0, 1),
  d0: new Pitch(0, 2),
  ds0: new Pitch(0, 3),
  e0: new Pitch(0, 4),
  f0: new Pitch(0, 5),
  fs0: new Pitch(0, 6),
  g0: new Pitch(0, 7),
  gs0: new Pitch(0, 8),
  a0: new Pitch(0, 9),
  as0: new Pitch(0, 10),
  b0: new Pitch(0, 11),

  c1: new Pitch(1, 0),
  cs1: new Pitch(1, 1),
  d1: new Pitch(1, 2),
  ds1: new Pitch(1, 3),
  e1: new Pitch(1, 4),
  f1: new Pitch(1, 5),
  fs1: new Pitch(1, 6),
  g1: new Pitch(1, 7),
  gs1: new Pitch(1, 8),
  a1: new Pitch(1, 9),
  as1: new Pitch(1, 10),
  b1: new Pitch(1, 11),

  c2: new Pitch(2, 0),
  cs2: new Pitch(2, 1),
  d2: new Pitch(2, 2),
  ds2: new Pitch(2, 3),
  e2: new Pitch(2, 4),
  f2: new Pitch(2, 5),
  fs2: new Pitch(2, 6),
  g2: new Pitch(2, 7),
  gs2: new Pitch(2, 8),
  a2: new Pitch(2, 9),
  as2: new Pitch(2, 10),
  b2: new Pitch(2, 11),

  c3: new Pitch(3, 0),
  cs3: new Pitch(3, 1),
  d3: new Pitch(3, 2),
  ds3: new Pitch(3, 3),
  e3: new Pitch(3, 4),
  f3: new Pitch(3, 5),
  fs3: new Pitch(3, 6),
  g3: new Pitch(3, 7),
  gs3: new Pitch(3, 8),
  a3: new Pitch(3, 9),
  as3: new Pitch(3, 10),
  b3: new Pitch(3, 11),

  c4: new Pitch(4, 0),
  cs4: new Pitch(4, 1),
  d4: new Pitch(4, 2),
  ds4: new Pitch(4, 3),
  e4: new Pitch(4, 4),
  f4: new Pitch(4, 5),
  fs4: new Pitch(4, 6),
  g4: new Pitch(4, 7),
  gs4: new Pitch(4, 8),
  a4: new Pitch(4, 9),
  as4: new Pitch(4, 10),
  b4: new Pitch(4, 11),

  c5: new Pitch(5, 0),
  cs5: new Pitch(5, 1),
  d5: new Pitch(5, 2),
  ds5: new Pitch(5, 3),
  e5: new Pitch(5, 4),
  f5: new Pitch(5, 5),
  fs5: new Pitch(5, 6),
  g5: new Pitch(5, 7),
  gs5: new Pitch(5, 8),
  a5: new Pitch(5, 9),
  as5: new Pitch(5, 10),
  b5: new Pitch(5, 11),

  c6: new Pitch(6, 0),
  cs6: new Pitch(6, 1),
  d6: new Pitch(6, 2),
  ds6: new Pitch(6, 3),
  e6: new Pitch(6, 4),
  f6: new Pitch(6, 5),
  fs6: new Pitch(6, 6),
  g6: new Pitch(6, 7),
  gs6: new Pitch(6, 8),
  a6: new Pitch(6, 9),
  as6: new Pitch(6, 10),
  b6: new Pitch(6, 11),

  c7: new Pitch(7, 0),
  cs7: new Pitch(7, 1),
  d7: new Pitch(7, 2),
  ds7: new Pitch(7, 3),
  e7: new Pitch(7, 4),
  f7: new Pitch(7, 5),
  fs7: new Pitch(7, 6),
  g7: new Pitch(7, 7),
  gs7: new Pitch(7, 8),
  a7: new Pitch(7, 9),
  as7: new Pitch(7, 10),
  b7: new Pitch(7, 11),

  c8: new Pitch(8, 0),
  cs8: new Pitch(8, 1),
  d8: new Pitch(8, 2),
  ds8: new Pitch(8, 3),
  e8: new Pitch(8, 4),
  f8: new Pitch(8, 5),
  fs8: new Pitch(8, 6),
  g8: new Pitch(8, 7),
  gs8: new Pitch(8, 8),
  a8: new Pitch(8, 9),
  as8: new Pitch(8, 10),
  b8: new Pitch(8, 11)
};
exports.pitches = pitches;