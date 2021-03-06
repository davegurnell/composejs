#!/usr/bin/env bash

npm install

mkdir -p ./dist
babel ./src --out-dir ./lib --modules commonStrict
browserify --require ./src/index.js:compose --outfile dist/index.js --transform babelify
browserify --require ./src/index.js:compose --require ./src/demo.js:demo --outfile dist/demo.js  --transform babelify
