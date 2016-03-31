var _ = require('lodash');
var Vue = require('vue');

Vue.use(require('vue-resource'));
Vue.component('projects', require('./components/projects.vue'));

new Vue({
  el: 'body',
  data: {
    pagination: {
      perPage: 4,
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      pagesNumbers: [],
      paginated: []
    },
    projects: [],
    contributors: []
  },
  ready: function () {
    //this.fetchContributors();
  },
  methods: {
    fetchContributors: function () {
      this.$http({
          url: 'https://api.github.com/orgs/artesaos/members',
          method: 'GET'
        })
        .then(function (response) {
          this.contributors = response.data;
        });
    },
  }
});
