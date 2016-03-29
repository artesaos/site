var Vue = require('vue');
Vue.use(require('vue-resource'));

(function(){
	new Vue({
		el: '.app',
		data: {
			projects: [],
			contributors: []
		},
		ready: function () {
			this.fetchProjects();
            this.fetchContributors();
		},
		methods: {
			fetchProjects: function() {
				this.$http({
					url: 'artesaos-packages.json',
					method: 'GET'
				}).then(function(response){
					this.projects = response.data;
				});
			},
            fetchContributors: function() {
				this.$http({
					url: 'artesaos-contributors.json',
					method: 'GET'
				}).then(function(response){
					this.contributors = response.data;
				});
			}
		}
	});
})(Vue);