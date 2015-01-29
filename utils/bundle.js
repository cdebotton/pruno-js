"use strict";

var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var plugins = require('gulp-load-plugins')();

var PLUGIN_NAME = 'JsTask';

module.exports = function(pruno) {
  var bundle = function (gulp, bundler, params) {
    var path = params.dist.split('/');
    var fileName = path.pop();
    var dist = path.join('/');

    params || (params = {});

    pruno.notify(PLUGIN_NAME, 'Task `' + params.taskName + '` started!')

    return bundler.bundle()
      .on('error', function (err) {
        pruno.error(PLUGIN_NAME, err);
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
      .pipe(gulp.dest(dist))
      .pipe(pruno.notify(PLUGIN_NAME, 'Task `' + params.taskName + '` completed!'));
  };

  return bundle;
};
