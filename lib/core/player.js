"use strict";

// Score [String] [Number] [Number] -> Promise
exports.play = play;

var Q = require("q")["default"];

var _ = require("underscore")["default"];

var _score = require("./score");

var Score = _score.Score;
var Note = _score.Note;
var Rest = _score.Rest;
var Sequence = _score.Sequence;
var Parallel = _score.Parallel;
var Arrangement = _score.Arrangement;

var defaults = {
  context: new AudioContext(),
  instrument: "samples/bell.wav",
  tempo: 120,
  transpose: 0
};
function play(score) {
  var config = arguments[1] === undefined ? {} : arguments[1];

  config = _.extend(defaults, config);

  score = new Arrangement(score, config.instrument);

  return loadInstruments(config, instruments(score), config).then(function (buffers) {
    return _.extend({}, config, { buffers: buffers });
  }).then(function (config) {
    return playScore(score, config);
  })["catch"](function (exn) {
    return console.error(exn);
  })["finally"](function () {
    return console.log("Playback finished");
  });
}

// Score -> ArrayOf(Instrument)
function instruments(score) {
  if (score instanceof Note) {
    return [];
  } else if (score instanceof Rest) {
    return [];
  } else if (score instanceof Sequence) {
    return _.uniq(instruments(score.a).concat(instruments(score.b)));
  }if (score instanceof Parallel) {
    return _.uniq(instruments(score.a).concat(instruments(score.b)));
  } else if (score instanceof Arrangement) {
    return _.uniq([score.instrument].concat(instruments(score.score)));
  } else {
    throw new Error("instruments(): score not recognised: " + score);
  }
}

// ConfigObject ArrayOf(Instrument) -> MapOf(Instrument, PromiseOf(AudioBuffer))
function loadInstruments(config, instruments) {
  var promises = _.map(instruments, function (instrument) {
    return loadInstrument(config, instrument);
  });

  return Q.all(promises).then(function (buffers) {
    return _.object(_.zip(instruments, buffers));
  });
}

// ConfigObject Instrument -> PromiseOf(AudioBuffer)
function loadInstrument(config, instrument) {
  var url = instrument;
  var request = new XMLHttpRequest();
  var result = Q.defer();

  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  request.onload = function (event) {
    return config.context.decodeAudioData(request.response, function (buffer) {
      return result.resolve(buffer);
    });
  };

  request.send();

  return result.promise;
}

// Score ConfigObject -> Promise
function playScore(_x, _x2) {
  var _again = true;

  _function: while (_again) {
    _again = false;
    var score = _x,
        config = _x2;

    if (score instanceof Note) {
      return playSample(score.pitch, config).then(function (_) {
        return playWait(score.duration, config);
      });
    } else if (score instanceof Rest) {
      return playWait(score.duration, config);
    } else if (score instanceof Sequence) {
      return playScore(score.a, config).then(function (_) {
        return playScore(score.b, config);
      });
    } else if (score instanceof Parallel) {
      return Q.all([playScore(score.a, config), playScore(score.b, config)]);
    } else if (score instanceof Arrangement) {
      _x = score.score;
      _x2 = _.extend({}, config, { instrument: score.instrument });
      _again = true;
      continue _function;
    } else {
      throw new Error("playScore(): score not recognised: " + score);
    }
  }
}

// Pitch ConfigObject -> Promise
function playSample(pitch, config) {
  return Q.fcall(function (_) {
    var source = config.context.createBufferSource();
    var freq = frequency(pitch, config.transpose);
    source.buffer = config.buffers[config.instrument];
    source.connect(config.context.destination);
    source.playbackRate.setValueAtTime(freq / 440, 0);
    source.start(0);
    return "Done";
  });
}

// Duration ConfigObject -> Promise
function playWait(duration, config) {
  return Q.delay(milliseconds(duration, config.tempo));
}

// Pitch [Number] -> Number
function frequency(pitch) {
  var transpose = arguments[1] === undefined ? 0 : arguments[1];

  return Math.pow(2, (pitch.value + transpose) / 12) * 440;
}

// Duration [Number] -> Number
function milliseconds(duration) {
  var tempo = arguments[1] === undefined ? 120 : arguments[1];

  return duration.value / 32 * (120 / tempo) * 2000;
}