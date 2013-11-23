var config = require('../config');
var GitHubApi = require('github');
var github = new GitHubApi({
  version: "3.0.0"
});
var git = exports;
git.addComment = function (comment, pullnumber) {
  github.authenticate({
    type: "basic",
    username: config.githubuser,
    password: config.githubpass
  });

  github.issues.createComment({"user": config.githubuser, "repo": config.gitrepo, "number": pullnumber, "body": comment}, '', function (err, res) {
    console.log(err, res);
  });
}

git.getPullNumber = function(str) {
  var pullnumber = str.split("Merge pull request #");
  pullnumber.shift();
  var pullstring = pullnumber.toString();
  var pullarr = pullstring.split(" ")
  var res = pullarr[0];
  return res;
}

