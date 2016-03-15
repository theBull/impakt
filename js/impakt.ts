
// declare third-party libraries
declare var $: any;
declare var angular: any;
declare var Raphael: any;
declare var async: any;
declare var objectHash: any;
declare var LZString: any;
declare var canvg: any;

// global impakt namespace
var impakt: any = {};

// global application context storage
impakt.context = {}

impakt.app = angular.module('impakt.app', [
	// module registration
	'ui.router', 
	'ui.bootstrap',
	'impakt.common',
	'impakt.modules'
])
.config(
	[
		'$stateProvider', 
		'$urlRouterProvider', 
		'$httpProvider', 
	function(
		$stateProvider: any, 
		$urlRouterProvider: any,
		$httpProvider: any) {

		console.log('impakt - config');

		//$urlRouterProvider.otherwise('/');

		// impakt module states - should these be module-specific?
		$stateProvider
			.state('team', {
				url: '/team',
				templateUrl: 'modules/team/team.tpl.html'
			})
			.state('profile', {
				url: '/profile',
				templateUrl: 'modules/user/user.tpl.html'
			});
			// TODO @theBull - implement
			// .state('film', {
			// 	url: '/film',
			// 	templateUrl: 'modules/film/film.tpl.html'
			// })
			// .state('stats', {
			// 	url: '/stats',
			// 	templateUrl: 'modules/stats/stats.tpl.html'
			// });

		

		console.debug('impakt - config');

}])
.run([
	'$http', '$window', '__auth', '__localStorage', '__context',
	function($http: any, $window: any, __auth: any, __localStorage: any, __context: any) {
	
	console.debug('impakt - running');

	// TODO: Change to application/json?
	$http.defaults.headers.common =	{ 
		'Content-Type': 'application/json'
	};

	let accessToken = __localStorage.getAccessToken();
	if (accessToken) {
		$http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
	} else {
		$window.location.href = '/signin.html';
	}

	// make application context requests
	__context.initialize(impakt.context).then(function(results) {
		console.log('Context initialization complete.');
	}, function(err) {
		console.log(err);
	});

}]);


impakt.signin = angular.module('impakt.signin', [
	// module registration
	'ui.router',
	'ui.bootstrap',
	'impakt.common'
])
	.config(
	[
		function() {

			console.debug('impakt.signin - config');

		}])
	.run([
		'$http', 
		'$window', 
		'$location', 
		'__signin',
		function(
			$http: any, 
			$window: any, 
			$location: any, 
			__signin: any
		) {

			console.debug('impakt.signin - running');

			// TODO: Change to application/json?
			$http.defaults.headers.common =
				{ 'Content-Type': 'application/json' };

			// attempt login
			//__signin.signin();

		}]);



