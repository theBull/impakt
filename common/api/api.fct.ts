/// <reference path='./api.mdl.ts' />

impakt.common.api.factory('__api', [
'API', 
'AUTH', 
'$http', 
'$q',
'__localStorage',
function(
	API: any, 
	AUTH: any, 
	$http: any, 
	$q: any,
	__localStorage: any
) {

	let self = {
		post: post,
		get: get,
		path: path
	}

	function post(endpointUrl, data) {
		let d = $q.defer();
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
		let d = $q.defer();
		$http({
			method: 'GET',
			url: path(API.HOST_URL, API.ENDPOINT, endpointUrl),
			headers: {
			   'X-HTTP-Method-Override': 'POST'
			},
			data: { 
				"OrganizationKey": __localStorage.getOrganizationKey()
			}
		}).then(function(data) {
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
