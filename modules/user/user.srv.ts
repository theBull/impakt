/// <reference path='./user.mdl.ts' />

impakt.user.service('_user', [
'USER',
'$window',
'$q',
'__context',
'__api',
'__notifications',
'__localStorage',
'_userModals',
function(
	USER: any,
	$window: any,
	$q: any,
	__context: any,
	__api: any,
	__notifications: any,
	__localStorage: any,
	_userModals: any
) {

	this.userName = __localStorage.getUserName();
	this.organizationKey = __localStorage.getOrganizationKey();
	this.organizations = new User.Models.OrganizationCollection();
	this.selectedOrganization = null;

	this.isOnline = navigator ? navigator.onLine : undefined;

	let self = this;
	this.initialize = function() {
		
		let d = $q.defer();
		let notification = __notifications.pending('Looking for default user organization...');
		let organizationKey = __localStorage.getOrganizationKey();
		
		self.getOrganizations().then(function(organizations: User.Models.OrganizationCollection) {
			
			// select default organization from localStorage
			if(organizations && organizations.hasElements() && 
				organizationKey && organizationKey > 0) {
				let selectedOrganization = organizations.filterFirst(
					function(organization, index) {
						return organization.organizationKey == organizationKey;
					});
				self.selectOrganization(selectedOrganization);
				notification.success('Default user organization #', organizationKey, ' is set');
				d.resolve(self.selectedOrganization);
			} else {
				// open select organization dialog
				notification.warning('Default organization not found. Please select \
					an organization from the Profile area.');
				_userModals.selectOrganization();
				d.resolve(null);
			}

		}, function(err) {
			notification.error('Failed to set default organization #', organizationKey);
			d.reject(err);
		});
		return d.promise;
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
		let d = $q.defer();

		let notification = __notifications.pending('Updating application context data...');

		if(!organization) {
			let errorMessage = 'Something went wrong while attempting to select the organization';
			notification.error(errorMessage);
			d.reject(errorMessage);
		}

		this.selectedOrganization = organization;
		impakt.context.Organization.current = organization;
		
		__localStorage.setOrganizationKey(organization.organizationKey);

		// make application context requests
		__context.initialize(impakt.context).then(function(results) {
			notification.success('Successfully updated the application context data');
			d.resolve(self.selectedOrganization);
		}, function(err) {
			notification.error('Failed to update the application context data');
			d.reject(err);
		});
		return d.promise;
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
						self.organizations.add(organizationModel, false);
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

}]);