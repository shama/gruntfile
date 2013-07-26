var path = require('path');
var grunt = require('grunt');
var test = require('tape');

var gruntBin = path.join(__dirname, '..', 'node_modules', '.bin', 'grunt');
var testkey = 'testoutput:';

function testout(args, fn) {
  grunt.util.spawn({
    cmd: process.argv[0],
    args: [gruntBin, '--base', __dirname, '--gruntfile', __dirname + '/Gruntfile.js', '--no-color'].concat(args)
  }, function(err, res, code) {
    if (err) return fn(err);
    var out = String(res.stdout).split(grunt.util.linefeed).filter(function(line) {
      return (line.slice(0, testkey.length) === testkey);
    }).map(function(line) {
      return line.slice(testkey.length);
    });
    fn(null, JSON.parse(out));
  });
}

test('module-test loaded and ran', function(t) {
  t.plan(1);
  testout(['test'], function(err, res) {
    t.ok(res.ran.moduletest);
  });
});
