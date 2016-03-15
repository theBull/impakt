/// <reference path='./user.mdl.ts' />

impakt.user.service('_user', [
'USER',
'$window',
'$q',
'__context',
'__api',
'__notifications',
'__localStorage',
function(
	USER: any,
	$window: any,
	$q: any,
	__context: any, // TODO @theBull - might not need this after the Alpha
	__api: any,
	__notifications: any,
	__localStorage: any
) {

	this.userName = __localStorage.getUserName();
	this.organizationKey = __localStorage.getOrganizationKey();
	this.organizations = new User.Models.OrganizationCollection();
	this.selectedOrganization = null;

	this.isOnline = navigator ? navigator.onLine : undefined;

	let self = this;
	function init() {
		self.getOrganizations();
	}

	$window.addEventListener("offline", function(e) { 
		console.log('offline');
		self.isOnline = false;
	});
	$window.addEventListener("online", function(e) { 
		console.log('online');
		self.isOnline = true;
	});

	this.selectOrganization = function(organization: User.Models.Organization) {
		this.selectedOrganization = organization;
		__localStorage.setOrganizationKey(organization.organizationKey);

		let notification = __notifications.pending('Updating application context data...');
		// make application context requests
		__context.initialize(impakt.context).then(function(results) {
			notification.success('Successfully updated the application context data');
		}, function(err) {
			notification.error('Failed to update the application context data');
		});
	}

	this.getOnlineStatusString = function() {
		return this.isOnline === true ? "online": 
			this.isOnline === false ? "offline" : "unknown";
	}

	this.getOrganizations = function() {
		let d = $q.defer();
		let notification = __notifications.pending('Retrieving Organizations...');
		__api.get(
			__api.path(
				USER.ORG_ENDPOINT,
				USER.GET_ORGANIZATIONS
			)
		).then(function(response: any) {

			if(response && response.data && response.data.results) {
				let results = response.data.results;
				for (let i = 0; i < results.length; i++) {
					let result = response.data.results[i];
					if(result) {
						let organizationModel = new User.Models.Organization();
						organizationModel.fromJson(result);
						self.organizations.add(organizationModel);
					}
				}
			}
			notification.success(self.organizations.size(), ' Organizations successfully retrieved');
			d.resolve(self.organizations);
		}, function(err) {
			notification.error('Failed to retrieve Organizations');
			d.reject(err);
		});
		return d.promise;
	}

	init();

}]);