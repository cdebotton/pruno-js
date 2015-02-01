"use strict";

var assign = require('object-assign');
var browserify = require('browserify');
var watchify = require('watchify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var plugins = require('gulp-load-plugins')();
var envify = require('envify/custom');
var to5ify = require('6to5ify');
var to5Runtime = require('./utils/to5Runtime');
var onError = require('./utils/on-error');

var PLUGIN_NAME = 'JsTask';

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

var bundle = function (gulp, bundler, params) {
  var path = params.dist.split('/');
  var fileName = path.pop();
  var dist = path.join('/');

  params || (params = {});

  return bundler.bundle()
    .on('error', function (err) {
      this.emit('end');
    })
    .pipe(source(fileName))
    .pipe(buffer())
    .pipe(
      plugins.if(
        params.uglify, plugins.uglify()
      )
    )
    .pipe(
      plugins.if(
        params['source-maps'], plugins.sourcemaps.init({loadMaps: true})
      )
    )
    .pipe(
      plugins.if(
        params['source-maps'], plugins.sourcemaps.write()
      )
    )
    .pipe(gulp.dest(dist));
};

function transform(bundler, params) {
  if (params.runtime) {
    bundler.transform(to5Runtime);
  }

  bundler.transform(envify({NODE_ENV: 'development'}));

  if (params.es6 || params.harmony || params.react) {
    bundler.transform(to5ify);
  }

  return bundler;
}

module.exports = JSTask;
