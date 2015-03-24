"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

// String -> Or(Duration, Undefined)
exports.parse = parse;

var Duration = exports.Duration = (function () {
  function Duration(value) {
    _classCallCheck(this, Duration);

    this.value = value;
  }

  _createClass(Duration, {
    d: {

      // Dotted, double-dotted, and triple-dotted variants.
      //
      // -> Duration

      get: function () {
        return new Duration(this.value * 1.5);
      }
    },
    dd: { // 1 1/2 notes

      get: function () {
        return new Duration(this.value * 1.75);
      }
    },
    ddd: { // 1 3/4 notes

      get: function () {
        return new Duration(this.value * 1.875);
      }
    },
    gt: { // 1 7/8 notes

      // Duration -> Boolean

      value: function gt(that) {
        return this.value > that.value;
      }
    },
    multiply: {

      // Number -> Duration

      value: function multiply(num) {
        return new Duration(this.value * num);
      }
    },
    minus: {

      // Duration -> Duration

      value: function minus(that) {
        return new Duration(this.value - that.value);
      }
    }
  });

  return Duration;
})();

// Duration
var thirtySecond = new Duration(1);
exports.thirtySecond = thirtySecond;
var sixteenth = new Duration(2);
exports.sixteenth = sixteenth;
var eighth = new Duration(4);
exports.eighth = eighth;
var quarter = new Duration(8);
exports.quarter = quarter;
var half = new Duration(16);
exports.half = half;
var whole = new Duration(32);exports.whole = whole;

function parse(str) {
  switch (str.toLowerCase()) {
    case "w":
      return whole;
    case "h":
      return half;
    case "q":
      return quarter;
    case "e":
      return eighth;
    case "s":
      return sixteenth;
    case "t":
      return thirtySecond;
    case "w.d":
      return whole.d;
    case "h.d":
      return half.d;
    case "q.d":
      return quarter.d;
    case "e.d":
      return eighth.d;
    case "s.d":
      return sixteenth.d;
    case "t.d":
      return thirtySecond.d;
    case "w.dd":
      return whole.dd;
    case "h.dd":
      return half.dd;
    case "q.dd":
      return quarter.dd;
    case "e.dd":
      return eighth.dd;
    case "s.dd":
      return sixteenth.dd;
    case "t.dd":
      return thirtySecond.dd;
    case "w.ddd":
      return whole.ddd;
    case "h.ddd":
      return half.ddd;
    case "q.ddd":
      return quarter.ddd;
    case "e.ddd":
      return eighth.ddd;
    case "s.ddd":
      return sixteenth.ddd;
    case "t.ddd":
      return thirtySecond.ddd;
    default:
      return undefined;
  }
}