"use strict";

var pruno = module.parent.require('pruno');
var assign = require('object-assign');
var browserify = require('browserify');
var watchify = require('watchify');

var plugins = require('gulp-load-plugins')();

var bundle = require('./utils/bundle')(pruno);
var transform = require('./utils/transform');
var onError = require('./utils/on-error');

function JSTask(params) {
  this.params = (params || {});
};

JSTask.displayName = 'JSTask';

JSTask.getDefaults = function() {
  return {
    'entry': '::src/index.js',
    'dist': '::dist/bundle.js',
    'uglify': false,
    'source-maps': true,
    'es6': false,
    'runtime': false
  };
};

JSTask.prototype.enqueue = function(gulp, params) {
  var args = assign({}, watchify.args, {
    entry: true,
    fullPaths: false
  });

  params || (params = {});

  var bundler = transform(browserify(params.entry, args), params);

  return bundle(gulp, bundler, params);
};

JSTask.prototype.generateWatcher = function(gulp, params) {
  return function() {
    var args = assign({}, watchify.args, {
      entry: true,
      fullPaths: true,
      debug: true
    });

    var bundler = transform(watchify(browserify(params.entry, args)), params);
    bundler.on('update', bundle.bind(bundle, gulp, bundler, params));

    return bundle(gulp, bundler, params);
  };
};

module.exports = JSTask;
