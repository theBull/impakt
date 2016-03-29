// Impakt Angular Controller
var App = angular.module('App', [
	'ngRoute', 
	'kendo.directives', 
	'App.playbookServices', 
	'App.authenticationServices'
]);

App.config(['$routeProvider',
function($routeProvider) {
	
	$routeProvider.when('/playbook', {
		templateUrl: 'views/playbook.html',
		controller: 'playbookController'
	})
	.otherwise({
		redirectTo: '/login'
	});
	
}]);


// Global Impakt app namespace
var Impakt = {
	Playbook: {
		Editor: {}
	}
}