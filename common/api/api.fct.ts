/// <reference path='./api.mdl.ts' />

impakt.common.api.factory('__api', [
	'API', 'AUTH', '$http', '$q',
	function(API: any, AUTH: any, $http: any, $q: any) {

	var self = {
		post: post,
		get: get,
		path: path
	}

	function post(endpointUrl, data) {
		var d = $q.defer();
		$http.post(
			path(API.HOST_URL, API.ENDPOINT, endpointUrl),
			JSON.stringify(data)
		).then(function(data) {
			// TODO: handle statuses manually
			//console.log(data);
			d.resolve(data);
		}, function(err) {
			console.error(err);
			d.reject(err);
		});
		return d.promise;
	}

	function get(endpointUrl) {
		var d = $q.defer();
		$http.get(
			path(API.HOST_URL, API.ENDPOINT, endpointUrl)
		).then(function(data) {
			// TODO: handle statuses manually
			//console.log(data);
			d.resolve(data);
		}, function(err) {
			console.error(err);
			d.reject(err);
		});
		return d.promise;
	}

	function path(...segments: string[]) {
		return segments.join('');
	}


	return self;
}]);
