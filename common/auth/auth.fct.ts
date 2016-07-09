/// <reference path='./auth.mdl.ts' />

(function() {

	let name = '__auth';

	impakt.common.auth.factory(name, [
		'AUTH', 'API', '$http', '$q', '__api', 'appConfigurator',
		function(AUTH: any, API: any, $http: any, $q: any, __api: any, appConfigurator: any) {

			var hostUrl = appConfigurator.hostUrl || API.HOST_URL;

			let self = {
				getToken: getToken
			}

			function getToken(username, password) {
				var d = $q.defer();

				let data = [
					'grant_type=password',
					'&username=', encodeURIComponent(username),
					'&Password=', password
				].join('');

				$http({
					method: 'POST',
					url: __api.path(hostUrl, AUTH.TOKEN_ENDPOINT),
					data: data,
					headers: { 
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function(data) {
					// TODO: handle statuses manually
					console.log(data);
					d.resolve(data);
				}, function(err) {
					console.error(err);
					d.reject(err);
				});
				return d.promise;
			}

			function createOrganization(organization: User.Models.Organization) {

				let orgData = organization.toJson();

			}

			return self;
		}]);

})();