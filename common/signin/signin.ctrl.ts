/// <reference path='./signin.mdl.ts' />

impakt.common.signin.controller('signin.ctrl', 
['$scope', '__signin',
function($scope: any, __signin: any) {

	$scope.data = {
		username: 'fredf@imanufacture.com',
		password: 'Abc123'
	}

	$scope.signin = function() {
		__signin.signin(
			$scope.data.username, 
			$scope.data.password
		);
	}

}]);