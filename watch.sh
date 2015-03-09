#!/usr/bin/env bash

watchify  --require ./src/main.js:compose --outfile dist/main.js --transform babelify --debug --watch
