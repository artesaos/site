var _ = require('lodash');
var Vue = require('vue');

Vue.use(require('vue-resource'));
Vue.component('projects', require('src::components/projects.vue'));
Vue.component('developers', require('src::components/developers.vue'));

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
    },
    methods: {}
});
