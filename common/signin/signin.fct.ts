/// <reference path='./signin.mdl.ts' />

impakt.common.signin.factory('__signin', [
	'$window',
	'__auth',
	'__localStorage',
	'SIGNIN',
	function($window: any, __auth: any, __localStorage: any, SIGNIN: any) {

		var self = {
			signin: signin,
			logout: logout
		}

		function signin(username, password) {
			// send a handshake
			__auth.getToken(username, password).then(function(data) {
				console.log(data);
				__localStorage.setAccessToken(data.data);
				$window.location.href = 'index.html';
			}, function(err) {
				console.error(err);
			});
		}

		function logout() {
			__localStorage.signout();
			$window.location.href = 'signin.html';
		}

		return self;
	}]);
