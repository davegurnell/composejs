"use strict";

exports.init = init;

var $ = require("jquery")["default"];

var CodeMirror = require("codemirror/lib/codemirror")["default"];

var CodeMirrorJs = require("codemirror/mode/javascript/javascript")["default"];

/*
 * Code needed to run the demo page in index.html.
 *
 * Not a core part of the ComposeJS distribution.
 */

// string -> string
function stripMargin(text) {
  var leadingWs = text.match(/^\n?(\s*)/)[1].length;
  var leadingTabs = text.match(/^\n?(\t*)/)[1].length;

  if (leadingTabs > 0) {
    text = text.replace(new RegExp("\\n?\\t{" + leadingTabs + "}", "g"), "\n");
  }

  if (leadingWs > 1) {
    text = text.replace(new RegExp("\\n? {" + leadingWs + "}", "g"), "\n");
  }

  return text.trim();
}

// string string -> string
function wrapScript(canvasId, code) {
  var noteVars = "";
  for (var _name in compose.score.note) {
    noteVars += "var " + _name + " = compose.score.note." + _name + ";\n";
  }

  return "\n    (function() {\n      var compose      = require('compose');\n      var Note         = compose.score.Note;\n      var Rest         = compose.score.Rest;\n      var Sequence     = compose.score.Sequence;\n      var Parallel     = compose.score.Parallel;\n      var Arrangement  = compose.score.Arrangement;\n      var Rest         = compose.score.Rest\n      var par          = compose.score.par;\n\t    var seq          = compose.score.seq;\n      var note         = compose.score.note;\n      var rest         = compose.score.rest;\n      var arrange      = compose.score.arrange;\n\t    var transpose    = compose.score.transpose;\n\t    var play         = compose.player.play;\n\n      var thirtySecond = compose.duration.thirtySecond;\n      var sixteenth    = compose.duration.sixteenth;\n      var eighth       = compose.duration.eighth;\n      var quarter      = compose.duration.quarter;\n      var half         = compose.duration.half;\n      var whole        = compose.duration.whole;\n\n      " + noteVars + " \n\n      function draw(img, config) {\n        compose.canvas.defaultStyle.strokeStyle = 'white';\n        compose.canvas.draw('" + canvasId + "', img, config);\n      }\n\n      " + code + "\n    })();\n  ";
}

var defaultCode = stripMargin("draw(new Circle(10));");

exports.defaultCode = defaultCode;
function editorConfig(code) {
  return {
    lineNumbers: true,
    mode: { name: "javascript", json: true },
    scrollbarStyle: "null",
    tabSize: 2,
    theme: "monokai",
    value: code,
    viewportMargin: Infinity
  };
}

function init(textarea, canvas) {
  textarea = $(textarea);
  canvas = $(canvas);

  var editor = CodeMirror.fromTextArea(textarea.get(0), editorConfig(defaultCode));

  canvas.attr({
    id: canvas.attr("id") || "canvas",
    width: canvas.width(),
    height: canvas.height()
  });

  function compile() {
    var canvasId = canvas.attr("id");
    var code = editor.getValue();
    var wrappedCode = wrapScript(canvasId, code);
    try {
      eval(wrappedCode);
    } finally {
      editor.refresh();
    }
  }

  editor.setOption("extraKeys", {
    "Cmd-Enter": compile,
    "Ctrl-Enter": compile
  });
}