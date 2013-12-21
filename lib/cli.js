var fs = require('fs'),
    optimist = require('optimist'),
    path = require('path'),
    _ = require('underscore'),
    expandTilde = require('tilde-expansion'),
    async = require('async');

module.exports = function cliParse(callback) {
  optimist.usage('Usage: $0 <sources.json>');

  var args = optimist.argv._;
  if (args.length !== 1) {
    die(optimist.help());
  }
  var sourcesPath = args[0];
  var sources = JSON.parse(fs.readFileSync(sourcesPath));

  if (!sources.dirs || !sources.ghAuth
      || !checkDirs(sources.dirs)
      || !checkGhAuth(sources.ghAuth)) {
    die(path.basename(sourcesPath)
      + ": missing JSON keys, see example at "
      + path.normalize(__dirname + '/../examples/sources.json'));
  }

  normalizeDirPaths(sources.dirs, function(err, dirs) {
    if (err) return callback(err);
    sources.dirs = dirs;
    callback(null, sources);
  });
}

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function checkDirs(dirs) {
  return _.all(dirs, function(dir) {
    return dir.name && dir.path && (!dir.exclude || _.isArray(dir.exclude));
  });
}

function checkGhAuth(auth) {
  return auth.username && auth.password;
}

function normalizeDirPaths(dirs, callback) {
  async.map(dirs, expand, callback);

  function expand(dir, cb) {
    expandTilde(dir.path, function(expandedPath) {
      var dup = _.clone(dir);
      dup.path = expandedPath;
      cb(null, dup);
    });
  }
}
