var request = require('request'),
    _ = require('underscore');

var GITHUB_API_URL = 'https://api.github.com';

module.exports = function getGitHubProjects(auth, callback) {
  var url = GITHUB_API_URL + '/user/repos';
  var opts = {
    auth: {
      username: auth.username,
      password: auth.password
    },
    // http://developer.github.com/v3/#user-agent-required
    headers: {
      'User-Agent': 'request'
    }
  };
  request(url, opts, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) {
      return callback(new Error('Unexpected response: ' + res.statusCode));
    }
    try {
      var repos = JSON.parse(body);
    } catch (e) {
      return callback(e);
    }
    var projects = _.map(repos, function(repo) {
      return {
        name: repo.name
      };
    });
    callback(null, projects);
  });
};
