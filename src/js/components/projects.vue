<script>
  var project = require('./project.vue');
  module.exports = {
    components: {
      project: project,
    },
    data: function () {
      return {
        pagination: {
          perPage: 4,
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          pagesNumbers: [],
          paginated: []
        },
        projects: [],
      }
    },
    props: {
      project_class: {
        type: String,
        default: 'col-md-3',
      }
    },
    ready: function () {
      this.fetchProjects();
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
      page: function (page) {
        this.pagination.currentPage = page;
        this.projects = this.pagination.paginated[page - 1];
      },
      next: function () {
        var self = this;
        if(self.pagination.currentPage < self.pagination.totalPages) {
          self.pagination.currentPage = self.pagination.currentPage + 1;
          self.projects = self.pagination.paginated[self.pagination.currentPage - 1];
        }
      },
      previous: function () {
        if(this.pagination.currentPage > 1) {
          this.pagination.currentPage = this.pagination.currentPage - 1;
          this.projects = this.pagination.paginated[this.pagination.currentPage - 1];
        }
      }
    }
  }
</script>

<template>
  <section class="packages">
    <div class="container">
  		<div class="row">
        <div class="section_header">
  				<h2>NOSSOS PACOTES</h2>
  				<span class="header_line"></span>
        </div>

        <div class="row">
          <div
            v-bind:class="project_class"
            v-for="project in projects">
            <project :project="project"></project>
          </div>
        </div>
      </div>

      <div class="text-center">
        <nav>
          <ul class="pagination">
              <li v-bind:class="{disabled:pagination.currentPage == 1}">
                <a href="#" aria-label="Previous" v-on:click.prevent="previous">
                    <span aria-hidden="true">«</span>
                </a>
              </li>
              <li v-for="(index, pag) in pagination.pagesNumbers" v-bind:class="{active:pagination.currentPage == pag}">
                <a href="#" v-on:click.prevent="page(pag)">{{ pag }}</a>
              </li>
              <li v-bind:class="{disabled:pagination.currentPage==pagination.totalPages}">
                <a href="#" aria-label="Next" v-on:click.prevent="next">
                  <span aria-hidden="true">»</span>
                </a>
              </li>
          </ul>
        </nav>
      </div>
    </div>
  </section>
</template>
