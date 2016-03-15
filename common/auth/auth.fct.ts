/// <reference path='./auth.mdl.ts' />

(function() {

	let name = '__auth';

	impakt.common.auth.factory(name, [
		'AUTH', 'API', '$http', '$q', '__api',
		function(AUTH: any, API: any, $http: any, $q: any, __api: any) {

			let self = {
				getToken: getToken
			}

			function getToken(username, password) {
				var d = $q.defer();

				let data = [
					'grant_type=password',
					'&username=', encodeURIComponent(username),
					'&Password=', password].join('');

				$http.post(
					__api.path(API.HOST_URL, AUTH.TOKEN_ENDPOINT),
					data,
					{ 'Content-Type': 'application/x-www-form-urlencoded' }
				).then(function(data) {
					// TODO: handle statuses manually
					console.log(data);
					d.resolve(data);
				}, function(err) {
					console.error(err);
					d.reject(err);
				});
				return d.promise;
			}

			return self;
		}]);

})();