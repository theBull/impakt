App.controller('userProfileController', 
['$scope', '$http', '$log', 'authenticationService', 
function($scope, $http, $log, authenticationService) {
	
	// Testing only
	$scope.profileClick = function() {

		authenticationService.getToken()
			.success(function(data) {
				console.log(data);
			})
			.error(function(err) {
				console.log(err);
			});
	}

}]);