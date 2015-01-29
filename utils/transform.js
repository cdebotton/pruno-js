"use strict";

var envify = require('envify');
var to5ify = require('6to5ify');

function transform(bundler, params) {
  if (params.runtime) {
    bundler.transform(to5Runtime);
  }

  bundler.transform(envify({NODE_ENV: 'development'}));

  if (params.es6 || params.harmony || params.react) {
    bundler.transform(to6ify);
  }

  return bundler;
}

module.exports = transform;
