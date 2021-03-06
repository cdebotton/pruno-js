"use strict";

var through = require('through');

function to5Runtime(file) {
  var data = '';
  var header = 'require("pruno-js/node_modules/6to5/polyfill");';
  var stream = through(write, end);

  function write(buf) {
    data += buf;
  }

  function end() {
    data = header + data;
    stream.queue(data);
    stream.queue(null);
  }

  return stream;
}

module.exports = to5Runtime;
