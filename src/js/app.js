var _ = require('lodash');
var Vue = require('vue');

Vue.use(require('vue-resource'));
Vue.component('projects', require('src::components/projects/index.vue'));
Vue.component('developers', require('src::components/developers/index.vue'));

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
