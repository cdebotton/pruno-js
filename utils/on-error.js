"use strict";

var onError = function(e) {
  new Notification().error(e, 'Browserify Compilation Failed!');

};

module.exports = onError;
