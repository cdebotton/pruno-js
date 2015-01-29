# pruno-js

A lightweight module that builds JavaScripts with Browserify. Handles React and ES6 transformations as well as uglify and source-maps.

## Usage

```js
"use strict";

var pruno = require('pruno');

pruno.plugins(function(mix) {
    mix
      .configure({ dir: __dirname + '/config' })
      .js({
        entry: '::src/index.js',
        dist: '::dist/bundle.js',
        es6: true,
        uglify: false,
        'source-maps': true
      });
});
```
