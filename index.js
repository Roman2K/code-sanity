var cli = require('./lib/cli'),
    print = require('./lib/print');

cli(function(err, args) {
  if (err) throw err;
  print(args.dirs, args.ghAuth);
});
