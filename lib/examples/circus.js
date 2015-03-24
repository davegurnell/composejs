"use strict";

var _coreScore = require("../core/score");

var par = _coreScore.par;
var seq = _coreScore.seq;
var transpose = _coreScore.transpose;

var bassLine = seq("g3.q, d3.q, a3.q, f3.q, c3.q, fs3.q");
var leftHand = par(bassLine, transpose(bassLine, -12));

exports["default"] = seq(par("b4.e,  b4.e, rest.e, b4.q, c5.q, b4.q, g4.e, a4.e, g4.e", "g4.e,  g4.e, rest.e, g4.q, g4.q, g4.q, d4.e, d4.e, d4.e", leftHand), par("a4.e,  g4.e, rest.e, g4.q, g4.q, g4.q, g4.e, fs4.e, g4.e", "d4.e,  d4.e, rest.e, d4.q, d4.q, d4.q, d4.e,  d4.e, d4.e", leftHand), par("fs4.e, d4.e, rest.e, d4.q, d4.q, d4.q, b3.e,  c4.e, b3.e", "d4.e,  b3.e, rest.e, b3.q, b3.q, b3.q, g3.e,  a3.e, g3.e", leftHand), par("c4.e,  b3.e, rest.e, b3.q, b3.q, b3.q, b3.e,  c4.e, d4.e", "a3.e,  g3.e, rest.e, g3.q, g3.q, g3.q, g3.e,  a3.e, b3.e", leftHand));