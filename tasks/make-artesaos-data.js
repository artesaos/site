"use strict";
const _ = require('lodash');
const GITHUB_AUTH_TOKEN = require('../.env.json').GITHUB_AUTH_TOKEN;
const ContributorsLoaderByOrg = require('./libs/contributors-loader-by-org.js');

const USER = 'artesaos';

const ContributorsByOrg = new ContributorsLoaderByOrg(USER, GITHUB_AUTH_TOKEN, ['laravel-docs']);

ContributorsByOrg.loadContributors()
  .then(constributors => console.log(constributors))
  .catch(err => console.log(err));
