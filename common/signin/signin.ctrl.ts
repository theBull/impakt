/// <reference path='./signin.mdl.ts' />

impakt.common.signin.controller('signin.ctrl', 
['$scope', '__signin', '__locale',
function($scope: any, __signin: any, __locale: any) {

	$scope.showSignin = true;
	$scope.showRegister = false;
	$scope.states = __locale.states;

	$scope.signinData = {
		username: '',
		password: ''
	}

	// $scope.user = new User.Models.UserModel();
	// $scope.user.firstName = 'Danny';
	// $scope.user.lastName = 'Bullis';
	// $scope.user.email = 'daniel.p.bullis@gmail.com';
	// $scope.user.organizationName = 'Test organization';

	$scope.signinMessage = '';

	$scope.organization = new User.Models.Organization();
	$scope.account = new User.Models.Account();

	$scope.toggleSignin = function(show?: boolean) {
		$scope.showSignin = show === true ? show : !$scope.showSignin;
		$scope.showRegister = !$scope.showSignin;
	}
	$scope.toggleRegister = function(show?: boolean) {
		$scope.showRegister = show === true ? show : !$scope.showRegister;
		$scope.showSignin = !$scope.showRegister;
	}

	$scope.createUser = function(next: Function) {
		console.log('creating user');
		__signin.registerUser($scope.user)
			.then(function(results) {
				console.log('user created', results);
			}, function(err) {
				console.error(err);
			});
	}
	$scope.createOrganization = function(next: Function) {
		console.log('creating organization');
		__signin.createOrganization($scope.organization)
		.then(function(results) {
			console.log('organization created', results);
		}, function(err) {
			console.error(err);
		});
		next();
	}
	$scope.createAccount = function(next: Function) {
		console.log('creating account');
		next();
	}


	$scope.signin = function() {
		__signin.signin(
			$scope.signinData.username, 
			$scope.signinData.password
		).then(function(results) {
			$scope.signinMessage = 'signin successful.';
		}, function(err) {
			$scope.signinMessage = err && err.data && err.data.error_description || 'Login failed.';
		});
	}

	$scope.register = function() {

	}

}]);