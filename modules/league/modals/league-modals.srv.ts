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


	/**
	 * 
	 * CONFERENCE
	 * 
	 */
	this.createConference = function(league?: League.Models.LeagueModel) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/league/modals/create-conference/create-conference.tpl.html',
			'league.modals.createConference.ctrl',
			{
				league: function() {
					return league;
				}
			}
		);

		modalInstance.result.then(function(createdConference: League.Models.Conference) {
			console.log(createdConference);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createConferenceDuplicate = function(conference: League.Models.Conference) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/league/modals/create-conference-duplicate-error/create-conference-duplicate-error.tpl.html',
			'league.modals.createConferenceDuplicateError.ctrl',
			{
				conference: function() {
					return conference;
				}
			}
		);

		modalInstance.result.then(function(createdConference) {
			console.log(createdConference);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deleteConference = function(conference: League.Models.Conference) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/league/modals/delete-conference/delete-conference.tpl.html',
			'league.modals.deleteConference.ctrl',
			{
				conference: function() {
					return conference;
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


	/**
	 * 
	 * DIVISION
	 * 
	 */
	this.createDivision = function(conference?: League.Models.Conference) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/league/modals/create-division/create-division.tpl.html',
			'league.modals.createDivision.ctrl',
			{
				conference: function() {
					return conference;
				}
			}
		);

		modalInstance.result.then(function(createdDivision: League.Models.Division) {
			console.log(createdDivision);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createDivisionDuplicate = function(division: League.Models.Division) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/league/modals/create-division-duplicate-error/create-division-duplicate-error.tpl.html',
			'league.modals.createDivisionDuplicateError.ctrl',
			{
				division: function() {
					return division;
				}
			}
		);

		modalInstance.result.then(function(createdDivision) {
			console.log(createdDivision);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deleteDivision = function(division: League.Models.Division) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/league/modals/delete-division/delete-division.tpl.html',
			'league.modals.deleteDivision.ctrl',
			{
				division: function() {
					return division;
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