import Q from 'q';
import _ from 'underscore';

import {
  Score,
  Note,
  Rest,
  Sequence,
  Parallel,
  Arrangement
} from './score';

const defaults = {
  context    : new AudioContext(),
  instrument : 'samples/bell.wav',
  tempo      : 120,
  transpose  : 0
};

// Score [String] [Number] [Number] -> Promise
export function play(score, config = {}) {
  config = _.extend(defaults, config);

  score = new Arrangement(score, config.instrument);

  return loadInstruments(config, instruments(score), config).
    then(buffers => _.extend({}, config, { buffers: buffers })).
    then(config => playScore(score, config)).
    catch(exn => console.error(exn)).
    finally(() => console.log("Playback finished"));
}

// Score -> ArrayOf(Instrument)
function instruments(score) {
  if(score instanceof Note) {
    return [];
  } else if(score instanceof Rest) {
    return [];
  } else if(score instanceof Sequence) {
    return _.uniq(instruments(score.a).concat(instruments(score.b)));
  } if(score instanceof Parallel) {
    return _.uniq(instruments(score.a).concat(instruments(score.b)));
  } else if(score instanceof Arrangement) {
    return _.uniq([ score.instrument ].concat(instruments(score.score)));
  } else {
    throw new Error("instruments(): score not recognised: " + score);
  }
}

// ConfigObject ArrayOf(Instrument) -> MapOf(Instrument, PromiseOf(AudioBuffer))
function loadInstruments(config, instruments) {
  console.log('loadInstruments', instruments);

  let promises = _.map(instruments, (instrument) =>
    loadInstrument(config, instrument));

  return Q.all(promises).
    then((buffers) => _.object(_.zip(instruments, buffers)));
}

// ConfigObject Instrument -> PromiseOf(AudioBuffer)
function loadInstrument(config, instrument) {
  console.log("loadInstrument", instrument);

  let url     = instrument;
  let request = new XMLHttpRequest();
  let result  = Q.defer();

  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = event => 
    config.context.decodeAudioData(request.response, buffer => 
      result.resolve(buffer));

  request.send();

  return result.promise;
}

// Score ConfigObject -> Promise
function playScore(score, config) {
  if(score instanceof Note) {
    return playSample(score.pitch, config).
      then(_ => playWait(score.duration, config));

  } else if(score instanceof Rest) {
    return playWait(score.duration, config);

  } else if(score instanceof Sequence) {
    return playScore(score.a, config).
      then(_ => playScore(score.b, config));

  } else if(score instanceof Parallel) {
    return Q.all([
      playScore(score.a, config),
      playScore(score.b, config)
    ]);

  } else if(score instanceof Arrangement) {
    return playScore(
      score.score,
      _.extend({}, config, { instrument: score.instrument })
    );

  } else {
    throw new Error("playScore(): score not recognised: " + score);
  }
}

// Pitch ConfigObject -> Promise
function playSample(pitch, config) {
  return Q.fcall(_ => {
    let source = config.context.createBufferSource();
    let freq   = frequency(pitch, config.transpose);
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
function frequency(pitch, transpose = 0) {
  return Math.pow(2, (pitch.value + transpose) / 12.0) * 440.0
}

// Duration [Number] -> Number
function milliseconds(duration, tempo = 120.0) {
  return (duration.value / 32.0) * (120.0 / tempo) * 2000
}
