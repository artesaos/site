"use strict";
const _ = require('lodash');
const path = require('path');
const GITHUB_AUTH_TOKEN = require('../.env.json').GITHUB_AUTH_TOKEN;
const ContributorsLoaderByOrg = require('./libs/contributors-loader-by-org.js');
const StoreJson = require('./libs/store-json.js');
const USER = 'artesaos';
const CONSTRIBUTORS_FILE = path.join(__dirname, '../artesaos-contributors.json');

const ContributorsByOrg = new ContributorsLoaderByOrg(USER, GITHUB_AUTH_TOKEN, ['laravel-docs', 'lumen-docs', 'laravel-docs.artesaos.org']);

ContributorsByOrg.loadContributors()
  .then(function (constributors) {
    (new StoreJson(constributors))
      .save(CONSTRIBUTORS_FILE, () => console.log(CONSTRIBUTORS_FILE + ' saved'));
  })
  .catch(err => console.log(err));
