"use strict";
const _ = require('lodash');
const GitHubApi = require("github");

class ContributorsLoaderByOrg {
  constructor(org, token, ignoreds) {
    this.org = org;
    this.ignoreds = ignoreds || [];
    this.github = new GitHubApi({
        version: "3.0.0",
        headers: {
          "user-agent": "Artesaos-Site-App"
        }
      });

    if(!_.isEmpty(token)) {
      this.github.authenticate({
        type: "oauth",
        token: token
      });
    }
  }

  getRepos() {
    return this._makeRequest({ user: this.org}, 'repos.getFromUser');
  }

  getContributorsByRepo(repo) {
    return this._makeRequest({ user: this.org, repo: repo }, 'repos.getContributors');
  }

  loadContributors() {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.getRepos()
        .then(function (res) {
          return _(res).map('name')
            .filter(name => self.ignoreds.indexOf(name) === -1)
            .value();
        })
        .then(function(repos) {
          self._processRepos(repos)
            .then(constributors => resolve(constributors))
            .catch(reject);
        })
        .catch(reject);
    });
  }

  _processRepos(repos) {
    var promises = [];
    _.forEach(repos, repo => promises.push(this.getContributorsByRepo(repo)));

    return Promise.all(promises)
      .then(lists => this._processContributors(_.flatten(lists)));
  }

  _processContributors(constributors) {
    return _(constributors)
      .uniqBy('login')
      .map(user => _.pick(user, ['login', 'avatar_url', 'url', 'html_url']))
      .orderBy('login')
      .value();
  }

  _makeRequest(msg, method) {
    const self = this;
    return new Promise(function(resolve, reject) {
      const callback = (err, res) => (err) ? reject(err) : resolve(res);
      _.get(self.github, method, undefined)(msg, callback);
    });
  }
}

module.exports = ContributorsLoaderByOrg;
