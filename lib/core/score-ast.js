"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Score = exports.Score = function Score() {
  _classCallCheck(this, Score);
};

var Note = exports.Note = (function (_Score) {
  // Pitch Duration -> Score

  function Note(pitch, duration) {
    _classCallCheck(this, Note);

    this.pitch = pitch;
    this.duration = duration;
  }

  _inherits(Note, _Score);

  _createClass(Note, {
    d: {

      // Syntax for dotted notes.
      //
      // -> Note

      get: function () {
        return new Note(this.pitch, this.duration.d);
      }
    },
    dd: {
      get: function () {
        return new Note(this.pitch, this.duration.dd);
      }
    },
    ddd: {
      get: function () {
        return new Note(this.pitch, this.duration.ddd);
      }
    }
  });

  return Note;
})(Score);

var Rest = exports.Rest = (function (_Score2) {
  // Duration -> Score

  function Rest(duration) {
    _classCallCheck(this, Rest);

    this.duration = duration;
  }

  _inherits(Rest, _Score2);

  _createClass(Rest, {
    d: {

      // Syntax for dotted notes.
      //
      // -> Note

      get: function () {
        return new Rest(this.duration.d);
      }
    },
    dd: {
      get: function () {
        return new Rest(this.duration.dd);
      }
    },
    ddd: {
      get: function () {
        return new Rest(this.duration.ddd);
      }
    }
  });

  return Rest;
})(Score);

var Sequence = exports.Sequence = (function (_Score3) {
  // Score Score -> Score

  function Sequence(a, b) {
    _classCallCheck(this, Sequence);

    this.a = a;
    this.b = b;
  }

  _inherits(Sequence, _Score3);

  return Sequence;
})(Score);

var Parallel = exports.Parallel = (function (_Score4) {
  // Score Score -> Score

  function Parallel(a, b) {
    _classCallCheck(this, Parallel);

    this.a = a;
    this.b = b;
  }

  _inherits(Parallel, _Score4);

  return Parallel;
})(Score);

var Arrangement = exports.Arrangement = (function (_Score5) {
  // Score Instrument -> Score

  function Arrangement(score, instrument) {
    _classCallCheck(this, Arrangement);

    this.score = score;
    this.instrument = instrument;
  }

  _inherits(Arrangement, _Score5);

  return Arrangement;
})(Score);