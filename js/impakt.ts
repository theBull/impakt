/// <reference path='../modules/modules.ts' />

// declare third-party libraries
declare var $: any;
declare var angular: any;
declare var Raphael: any;
declare var async: any;
declare var objectHash: any;
declare var LZString: any;
declare var canvg: any;
declare var moment: any;

// global impakt namespace
var impakt: any = {};

// global application context storage
impakt.context = {}

impakt.app = angular.module('impakt.app', [
	// module registration
	'ui.router', 
	'angular.filter',
	'ui.bootstrap',
	'impakt.common',
	'impakt.modules',
	'ngTagsInput'
])
.provider('appConfigurator', function() {
	var impaktSettings = {
		appVer: '0.0.0',
		hostUrl: undefined
	};
	return {
		set: function (overrides) {
                angular.extend(impaktSettings, overrides);
			},
		$get: function() {
			return impaktSettings;
		}
	};
})
.config(
	[
		'$stateProvider', 
		'$urlRouterProvider', 
		'$httpProvider',
		'$sceDelegateProvider', 
	function(
		$stateProvider: any, 
		$urlRouterProvider: any,
		$httpProvider: any,
		$sceDelegateProvider: any) {

		//Reset headers to avoid OPTIONS request (aka preflight)
		// $httpProvider.defaults.headers.common = {};
		// $httpProvider.defaults.headers.post = {};
		// $httpProvider.defaults.headers.put = {};
		// $httpProvider.defaults.headers.patch = {};

		$sceDelegateProvider.resourceUrlWhitelist([
			'self', 
			'https://test-impakt.azurewebsites.net/**',
			'http://test.impaktathletics.com/**',
			'*'
		]);

		//$urlRouterProvider.otherwise('/');

		// impakt module states - should these be module-specific?
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'modules/home/home.tpl.html'
			})
			.state('team', {
				url: '/team',
				templateUrl: 'modules/team/team.tpl.html'
			})
			.state('analysis', {
				url: '/analysis',
				templateUrl: 'modules/analysis/analysis.tpl.html'
			})
			.state('profile', {
				url: '/profile',
				templateUrl: 'modules/user/user.tpl.html'
			});		

		console.debug('impakt.app - config');

}])
.run([
	'$http', 
	'$window', 
	'__auth', 
	'__localStorage', 
	'__context', 
	'__notifications', 
	'_user',
	function(
		$http: any, 
		$window: any, 
		__auth: any, 
		__localStorage: any, 
		__context: any, 
		__notifications: any, 
		_user: any
	) {
	
	console.debug('impakt - running');

	let accessToken = __localStorage.getAccessToken();
	if (accessToken) {
		$http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;

		let notification = __notifications.pending('Initializing user...');
		_user.initialize().then(function() {
			notification.success('User successfully initialized');
		}, function(err) {
			notification.error('Failed to initialize user');
		});

	} else {
		$window.location.href = '/signin.html';
	}

}]);


impakt.signin = angular.module('impakt.signin', [
	// module registration
	'ui.router',
	'ui.bootstrap',
	'impakt.common'
])
.provider('appConfigurator', function() {
	var impaktSettings = {
		appVer: '0.0.0',
		hostUrl: undefined
	};
	return {
		set: function (overrides) {
                angular.extend(impaktSettings, overrides);
			},
		$get: function() {
			return impaktSettings;
		}
	};
})
.config([function() {
	console.debug('impakt.signin - config');
}])
.run([
'$http', 
'$window', 
'$location',
'$rootScope',
'__signin',
function(
	$http: any, 
	$window: any, 
	$location: any,
	$rootScope: any,
	__signin: any
) {

	console.debug('impakt.signin - running');

	// TODO: Change to application/json?
	$http.defaults.headers.common =
		{ 'Content-Type': 'application/json' };

	// attempt login
	//__signin.signin();

}]);



