/// <reference path='./league-modals.mdl.ts' />

impakt.league.modals.service('_leagueModals', [
'$q',
'__modals',
function($q: any, __modals: any) {

	/**
	 * 
	 * LEAGUE
	 * 
	 */
	this.createLeague = function() {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/league/modals/create-league/create-league.tpl.html',
			'league.modals.createLeague.ctrl',
			{}
		);

		modalInstance.result.then(function(createdLeague: League.Models.LeagueModel) {
			console.log(createdLeague);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	this.createLeagueDuplicate = function(leagueModel: League.Models.LeagueModel) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/league/modals/create-league-duplicate-error/create-league-duplicate-error.tpl.html',
			'league.modals.createLeagueDuplicateError.ctrl',
			{
				league: function() {
					return leagueModel;
				}
			}
		);

		modalInstance.result.then(function(createdLeague) {
			console.log(createdLeague);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	
	this.deleteLeague = function(league: League.Models.LeagueModel) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/league/modals/delete-league/delete-league.tpl.html',
			'league.modals.deleteLeague.ctrl',
			{
				league: function() {
					return league;
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