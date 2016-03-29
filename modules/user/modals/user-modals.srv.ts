/// <reference path='./user-modals.mdl.ts' />

impakt.user.modals.service('_userModals', [
'__modals',
function(__modals: any) {

	/**
	 * 
	 * PLAYBOOK
	 * 
	 */
	this.selectOrganization = function() {
		let modalInstance = __modals.open(
			'',
			'modules/user/modals/select-organization/select-organization.tpl.html',
			'user.modals.selectOrganization.ctrl',
			{}
		);

		modalInstance.result.then(function(selectedOrganization) {
			console.log(selectedOrganization);
		}, function(results) {
			console.log('dismissed');
		});
	}

}]);