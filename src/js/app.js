var _ = require('lodash');
var Vue = require('vue');

Vue.use(require('vue-resource'));

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
    this.fetchProjects();
    this.fetchContributors();
  },
  methods: {
    fetchProjects: function () {
      this.$http({
          url: 'artesaos-packages.json',
          method: 'GET'
        })
        .then(function (response) {
          var res = response.data,
            chunk;
          chunk = _.chunk(res, this.pagination.perPage);
          this.projects = chunk[0];
          this.pagination.paginated = chunk;
          this.pagination.totalItems = res.length;
          this.pagination.totalPages = Math.ceil(res.length / this.pagination.perPage);
          this.pagination.pagesNumbers = _.range(1, this.pagination.totalPages + 1);
        });
    },
    fetchContributors: function () {
      this.$http({
          url: 'https://api.github.com/orgs/artesaos/members',
          method: 'GET'
        })
        .then(function (response) {
          this.contributors = response.data;
        });
    },
    page: function (ev, page) {
      ev.preventDefault();
      this.pagination.currentPage = page;
      this.projects = this.pagination.paginated[page - 1];
    },
    next: function (ev) {
      var self = this;
      ev.preventDefault();
      if(self.pagination.currentPage < self.pagination.totalPages) {
        self.pagination.currentPage = self.pagination.currentPage + 1;
        self.projects = self.pagination.paginated[self.pagination.currentPage - 1];
      }
    },
    previous: function (ev) {
      ev.preventDefault();
      if(this.pagination.currentPage > 1) {
        this.pagination.currentPage = this.pagination.currentPage - 1;
        this.projects = this.pagination.paginated[this.pagination.currentPage - 1];
      }
    }
  }
});
