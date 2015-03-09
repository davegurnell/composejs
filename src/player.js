import { Command, NoteOn, Wait, compile } from './compile';
import { default as Q } from 'q';
import { default as _ } from 'underscore';

const defaults = {
  context   : new AudioContext(),
  url       : 'samples/cat9.wav',
  tempo     : 120,
  transpose : 0
};

// arayOf(Command) [string] [natural] [number] -> Promise
export function play(score, config = {}) {
  config = _.extend(defaults, config);

  return loadSound(config, config.url).
    then(buffer => _.extend(config, { buffer: buffer })).
    then(config => playCommands(compile(score), config));
}

// ConfigObject string -> PromiseOf(AudioBuffer)
function loadSound(config, url) {
  console.log("loadSound", url);

  var request = new XMLHttpRequest();
  var result  = Q.defer();

  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = event =>
    config.context.decodeAudioData(request.response, buffer => result.resolve(buffer));

  request.send();

  return result.promise;
}

// arrayOf(Command) ConfigObject -> Promise
function playCommands(commands, config) {
  if(commands.length == 0) {
    return Q.fcall(_ => "Done");
  } else {
    let [ head, ...tail ] = commands;
    if(head instanceof NoteOn) {
      return playNote(head.pitch.freq(config.transpose), config).
        then(_ => playCommands(tail, config));
    } else {
      return playWait(head.duration.millis(config.tempo), config).
        then(_ => playCommands(tail, config));
    }
  }
}

// number ConfigObject -> Promise
function playNote(freq, config) {
  return Q.fcall(_ => {
    let source = config.context.createBufferSource();
    source.buffer = config.buffer;
    source.connect(config.context.destination);
    source.playbackRate.setValueAtTime(freq / 440, 0);
    source.start(0);
    return "Done";
  });
}

// natural ConfigObject -> Promise
function playWait(millis, config) {
  return Q.delay(millis);
}
