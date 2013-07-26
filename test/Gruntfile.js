module.exports = function(grunt) {
  grunt.registerTask('done', function() {
    var out = JSON.stringify(grunt.config.getRaw()).replace(grunt.util.linefeed, '');
    console.log('testoutput:' + out);
  });

  grunt.registerTask('test', require('gruntfile-test')(grunt).concat('done'));
};