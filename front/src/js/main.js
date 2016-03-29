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
			// this.fetchContributors();
		},
		methods: {
			fetchProjects: function() {
				this.$http({
					url: 'artesao-packages.json',
					method: 'GET'
				}).then(function(response){
					this.projects = response.data;
				});
			}
		}
	});
})(Vue);