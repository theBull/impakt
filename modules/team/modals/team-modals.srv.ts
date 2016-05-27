/// <reference path='./team-modals.mdl.ts' />

impakt.team.modals.service('_teamModals', [
'$q',
'__modals',
function($q: any, __modals: any) {

	/**
	 * 
	 * Team
	 * 
	 */
	this.createTeam = function(division?: League.Models.Division) {
		let d = $q.defer();
		
		let modalInstance = __modals.open(
			'',
			'modules/team/modals/create-team/create-team.tpl.html',
			'team.modals.createTeam.ctrl',
			{
				division: function() {
					return division;
				}
			}
		);

		modalInstance.result.then(function(createdTeam) {
			console.log(createdTeam);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}

	this.createTeamDuplicate = function(teamModel: Team.Models.TeamModel) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/team/modals/create-team-duplicate-error/create-team-duplicate-error.tpl.html',
			'team.modals.createTeamDuplicateError.ctrl',
			{
				team: function() {
					return teamModel;
				}
			}
		);

		modalInstance.result.then(function(createdTeam) {
			console.log(createdTeam);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}

	this.deleteTeam = function(teamModel: Team.Models.TeamModel) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/team/modals/delete-team/delete-team.tpl.html',
			'team.modals.deleteTeam.ctrl',
			{
				team: function() {
					return teamModel;
				}
			}
		);

		modalInstance.result.then(function(results) {
			console.log(results);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}

}]);