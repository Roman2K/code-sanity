var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    async = require('async');

module.exports = function getDirProjects(dir, callback) {
  async.waterfall([getEntries, extractSubdirs, getGitStatus], callback);

  function getEntries(cb) {
    fs.readdir(dir.path, cb);
  }

  function extractSubdirs(entries, cb) {
    var paths = _.map(entries, function(e) { return path.join(dir.path, e) });
    async.filter(paths, isProjectDir, function(paths) {
      cb(null, paths);
    });
  }

  function isProjectDir(dirPath, callback) {
    if (dir.exclude && _.include(dir.exclude, path.basename(dirPath))) {
      return callback(false);
    }
    isDir(dirPath, callback);
  }

  function getGitStatus(paths, cb) {
    async.map(paths, buildProject, cb);

    function buildProject(dirPath, cb) {
      isDir(path.join(dirPath, '.git'), function(isGitRepo) {
        cb(null, {
          name: path.basename(dirPath),
          local: dir.name,
          git: isGitRepo
        });
      });
    }
  }
};

function isDir(path, callback) {
  fs.stat(path, function(err, stat) {
    return callback(!err && stat.isDirectory());
  });
}
