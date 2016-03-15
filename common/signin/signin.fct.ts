/// <reference path='./signin.mdl.ts' />

impakt.common.signin.factory('__signin', [
'$q',
'$window',
'__api',
'__auth',
'__localStorage',
'SIGNIN',
function(
	$q: any, 
	$window: any,
	__api: any,
	__auth: any, 
	__localStorage: any, 
	SIGNIN: any
) {

	var self = {
		signin: signin,
		logout: logout,
		registerUser: registerUser,
		createOrganization: createOrganization
	}

	function signin(username, password) {
		let d = $q.defer();
		// send a handshake
		__auth.getToken(username, password).then(function(data) {
			console.log(data);
			__localStorage.setAccessToken(data.data);
			$window.location.href = 'index.html';
			d.resolve(data);
		}, function(err) {
			console.error(err);
			d.reject(err);
		});
		return d.promise;
	}

	function logout() {
		__localStorage.signout();
		$window.location.href = 'signin.html';
	}

	/**
	 * Takes the given user information (first, last, email, org name)
	 * and sends an registration confirmation email (invite) to the user
	 * @param {User.Models.UserModel} userModel user to register
	 */
	function registerUser(userModel: User.Models.UserModel) {
		let d = $q.defer();

		let userModelJson = userModel.toJson();

		__api.post(
			__api.path(
				SIGNIN.INVITE_ENDPOINT, SIGNIN.REGISTER_USER
			),
			{
				version: 1,
				FirstName: userModel.firstName,
				LastName: userModel.lastName,
				OrganizationKey: 0,
				OrganizationName: userModel.organizationName,
				Email: userModel.email,
				data: {
					version: 1,
					FirstName: userModel.firstName,
					LastName: userModel.lastName,
					OrganizationKey: 0,
					OrganizationName: userModel.organizationName,
					Email: userModel.email,
					user: userModelJson
				}
			}
		).then(function(results) {

			// TODO - @theBull handle register user results

			d.resolve(results);
		}, function(error) {
			d.reject(error);
		});

		return d.promise;
	}

	function createOrganization(organization: User.Models.Organization) {
		let d = $q.defer();

		let organizationJson = organization.toJson();

		__api.post(
			__api.path(SIGNIN.ORG_ENDPOINT, SIGNIN.CREATE_ORGANIZATION),
			{
                version: 1,
                data: {
                    version: 1,
                    organization: organizationJson
                }
            }
		).then(function(response: any) {
			let results = Common.Utilities.parseData(response.data.results);
            let createdOrganization = new User.Models.Organization();
            
            if(results) {
				createdOrganization.fromJson(results)	
            } else {
				d.reject(null);
            }
            
			d.resolve(createdOrganization);
		}, function(err) {
			d.reject(err);
		});
		return d.promise;
	}

	return self;
}]);
