var getProjects = require('./merge'),
    Table = require('cli-table'),
    color = require('cli-color'),
    _ = require('underscore');

module.exports = function print(dirs, ghAuth) {
  getProjects(dirs, ghAuth, function(err, projects) {
    if (err) throw err;
    var table = new Table({
      head: ["Project", "Local", "Git", "GitHub"]
    });
    projects = _.sortBy(projects, function(p) { return [p.local, p.name] });
    projects.forEach(function(p) {
      if (p.local) {
        table.push([
          color.yellow(p.name),
          p.local,
          p.git ? color.green("Git") : color.red("No"),
          p.github ? color.green("GitHub") : color.red("No"),
        ]);
      } else {
        table.push([
          p.name,
          "",
          "",
          p.github ? "GitHub" : "No"  // should always be "GitHub"
        ]);
      }
    });
    console.log(table.toString());
  });
}
