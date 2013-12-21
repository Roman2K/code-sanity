var async = require('async'),
    _ = require('underscore'),
    getDirProjects = require('./dir'),
    getGitHubProjects = require('./github');

module.exports = function mergeProjects(dirs, ghAuth, callback) {
  async.parallel({dirs: dirsGetter, github: githubGetter}, mergeResults);

  function dirsGetter(cb) {
    async.map(dirs, getDirProjects, function(err, results) {
      if (err) return cb(err);
      var projects = []
      results.forEach(function(list) {
        projects = projects.concat(list);
      });
      cb(null, projects);
    });
  }

  function githubGetter(cb) {
    getGitHubProjects(ghAuth, cb);
  }

  function mergeResults(err, results) {
    if (err) return callback(err);
    var projects = [];
    var seen = {};
    var git = _.indexBy(results.github, 'name');
    results.dirs.forEach(function(p) {
      if (git[p.name]) p.github = true;
      projects.push(p);
      seen[p.name] = true;
    });
    results.github.forEach(function(p) {
      if (seen[p.name]) return;
      p.github = true;
      projects.push(p);
    });
    callback(null, projects);
  }
}
