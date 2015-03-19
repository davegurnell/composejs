import $ from 'jquery';

import CodeMirror   from 'codemirror/lib/codemirror';
import CodeMirrorJs from 'codemirror/mode/javascript/javascript';

/*
 * Code needed to run the demo page in index.html.
 *
 * Not a core part of the ComposeJS distribution.
 */

// string -> string
function stripMargin(text) {
  let leadingWs = text.match( /^\n?(\s*)/ )[1].length;
  let leadingTabs = text.match( /^\n?(\t*)/ )[1].length;

  if( leadingTabs > 0 ) {
    text = text.replace( new RegExp('\\n?\\t{' + leadingTabs + '}','g'), '\n' );
  }
  
  if( leadingWs > 1 ) {
    text = text.replace( new RegExp('\\n? {' + leadingWs + '}','g'), '\n' );
  }

  return text.trim();
}

// string string -> string
function wrapScript(canvasId, code) {
  var noteVars = '';
  for(let name in compose.score.note) {
    noteVars += `var ${name} = compose.score.note.${name};\n`
  }

  return `
    (function() {
      var compose      = require('compose');
      var Note         = compose.score.Note;
      var Rest         = compose.score.Rest;
      var Sequence     = compose.score.Sequence;
      var Parallel     = compose.score.Parallel;
      var Arrangement  = compose.score.Arrangement;
      var Rest         = compose.score.Rest
      var par          = compose.score.par;
	    var seq          = compose.score.seq;
      var note         = compose.score.note;
      var rest         = compose.score.rest;
      var arrange      = compose.score.arrange;
	    var transpose    = compose.score.transpose;
	    var play         = compose.player.play;

      var thirtySecond = compose.duration.thirtySecond;
      var sixteenth    = compose.duration.sixteenth;
      var eighth       = compose.duration.eighth;
      var quarter      = compose.duration.quarter;
      var half         = compose.duration.half;
      var whole        = compose.duration.whole;

      ${noteVars} 

      function draw(img, config) {
        compose.canvas.defaultStyle.strokeStyle = 'white';
        compose.canvas.draw('${canvasId}', img, config);
      }

      ${code}
    })();
  `;
}

export var defaultCode = stripMargin("draw(new Circle(10));");

function editorConfig(code) {
  return {
    lineNumbers: true,
    mode: { name: 'javascript', json: true },
    scrollbarStyle: 'null',
    tabSize: 2,
    theme: 'monokai',
    value: code,
    viewportMargin: Infinity
  };
}

export function init(textarea, canvas) {
  textarea = $(textarea);
  canvas = $(canvas);

  let editor = CodeMirror.fromTextArea(
    textarea.get(0),
    editorConfig(defaultCode)
  );

  canvas.attr({
    id     : canvas.attr('id') || 'canvas',
    width  : canvas.width(),
    height : canvas.height()
  });

  function compile() {
    let canvasId    = canvas.attr('id');
    let code        = editor.getValue();
    let wrappedCode = wrapScript(canvasId, code);
    try {
      eval(wrappedCode);
    } finally {
      editor.refresh();
    }
  }

  editor.setOption('extraKeys', {
    'Cmd-Enter': compile,
    'Ctrl-Enter': compile
  });
}
