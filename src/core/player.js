import { Command, NoteOn, Wait, compile } from './compile';
import { default as Q } from 'q';
import { default as _ } from 'underscore';

const defaults = {
  context    : new AudioContext(),
  instrument : 'samples/bell.wav',
  tempo      : 120,
  transpose  : 0
};

// ArrayOf(Command) [String] [Number] [Number] -> Promise
export function play(score, config = {}) {
  config = _.extend(defaults, config);

  let commands = compile(score, defaults.instrument);
  
  let instruments = _.chain(commands)
    .filter(cmd => cmd instanceof NoteOn)
    .map(cmd => cmd.instrument)
    .uniq()
    .value();

  return loadInstruments(config, instruments).
    then(buffers => _.extend(config, { buffers: buffers })).
    then(config => playCommands(commands, config));
}

// ConfigObject ArrayOf(Instrument) -> MapOf(Instrument, PromiseOf(AudioBuffer))
function loadInstruments(config, instruments) {
  let promises = _.map(instruments, (instrument) =>
    loadInstrument(config, instrument));

  return Q.all(promises).then((buffers) =>
    _.object(_.zip(instruments, buffers)));
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
    config.context.decodeAudioData(request.response, buffer => result.resolve(buffer));

  request.send();

  return result.promise;
}

// ArrayOf(Command) ConfigObject -> Promise
function playCommands(commands, config) {
  if(commands.length == 0) {
    return Q.fcall(_ => "Done");
  } else {
    let [ head, ...tail ] = commands;
    if(head instanceof NoteOn) {
      return playNote(head, config).
        then(_ => playCommands(tail, config));
    } else {
      return playWait(head, config).
        then(_ => playCommands(tail, config));
    }
  }
}

// Note ConfigObject -> Promise
function playNote(note, config) {
  return Q.fcall(_ => {
    let source = config.context.createBufferSource();
    let freq   = frequency(note.pitch, config.transpose);
    source.buffer = config.buffers[note.instrument];
    source.connect(config.context.destination);
    source.playbackRate.setValueAtTime(freq / 440, 0);
    source.start(0);
    return "Done";
  });
}

// Note ConfigObject -> Promise
function playWait(note, config) {
  return Q.delay(milliseconds(note.duration, config.tempo));
}

// Pitch [Number] -> Number
function frequency(pitch, transpose = 0) {
  return Math.pow(2, (pitch.value + transpose) / 12.0) * 440.0
}

// Duration [Number] -> Number
function milliseconds(duration, tempo = 120.0) {
  return (duration.value / 32.0) * (120.0 / tempo) * 2000
}
