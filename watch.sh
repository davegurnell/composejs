#!/usr/bin/env bash

mkdir -p ./dist
watchify --require ./src/index.js:compose --require ./src/demo.js:demo --outfile dist/demo.js  --transform babelify --debug
