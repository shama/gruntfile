# gruntfile

Gruntfile helper for making modular gruntfiles. This module will always set the
current working directory relative to the gruntfile. This allows you to use a
gruntfile as a module.

## example

We have a gruntfile that loads common things across many projects.

First `npm install gruntfile --save` in a module and setup your gruntfile:

**./node_modules/modulargrunt/Gruntfile.js**
```js
module.exports = require('gruntfile')(function(grunt) {
  // These will become a default configs for inherited gruntfiles
  grunt.initConfig({
    browserify: {
      dev: {
        src: ['js/*.js'],
        dest: 'dist/js/index.js',
      },
    },
    compass: {
      dev: {
        options: {
          sassDir: 'scss',
          cssDir: 'dist/css',
        },
      },
    },
    jshint: {
      all: ['js/*.js'],
    },
  });
  // All tasks must be loaded relative to the module in node_modules
  // This should also be --save as they're now dependencies
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
});
```

Now you can install your module with `npm install` (if published) or `npm link`
as a local development dependency:

**./Gruntfile.js**
```js
module.exports = function(grunt) {

  // Init our modular gruntfile and return the tasks it uses
  var tasks = require('modulargrunt')(grunt);

  grunt.initConfig({
    // Add new task config
    watch: {
      livereload: {
        options: { livereload: true },
        files: ['dist/**/*'],
      },
      js: {
        files: ['js/*.js', 'Gruntfile.js'],
        tasks: ['browserify'],
      },
      css: {
        files: ['scss/*.scss'],
        tasks: ['compass'],
      },
    },
    // Override inherited task config
    browserify: {
      dev: {
        src: ['js/*.js'],
        dest: 'i/now/go/somewhere/else.js',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');

  // Run the tasks from modulargrunt and append the watch task at the end
  grunt.registerTask('default', tasks.concat('watch'));
};
```

## api

### `require('gruntfile')(gruntfile)`
It accepts a `gruntfile` function as the only argument and returns a wrapped
gruntfile like `function(grunt, parentCWD)`.

Will default the `cwd` relative to the gruntfile. If `parentCWD` is `false` then
the gruntfile has no parent otherwise it will be the path to the parent that
called the child gruntfile.

By default it will return the tasks initialized within the modular gruntfile.
You can override this and return whatever you like instead:

```js
module.exports = require('gruntfile')(function(grunt, parentCWD) {

  /* gruntfile stuff */

  return ['some', 'other', 'tasks'];
});
```

## Is this a good idea?
I don't know. Probably not but a lot of people keep asking for this. FWIW, I've
used a similar setup to this and it worked well. But I was always careful to
keep my gruntfiles as simple as possible.

## Release History

* 0.1.0 initial release

## License

Copyright (c) 2013 Kyle Robinson Young  
Licensed under the MIT license.
