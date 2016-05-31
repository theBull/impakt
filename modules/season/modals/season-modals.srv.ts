/// <reference path='./season-modals.mdl.ts' />

impakt.season.modals.service('_seasonModals', [
'$q',
'__modals',
function(
	$q: any, 
	__modals: any
) {

	/**
	 * 
	 * SEASON
	 * 
	 */
	this.createSeason = function() {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/season/modals/create-season/create-season.tpl.html',
			'season.modals.createSeason.ctrl',
			{}
		);

		modalInstance.result.then(function(createdSeason: Season.Models.SeasonModel) {
			console.log(createdSeason);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	this.createSeasonDuplicate = function(seasonModel: Season.Models.SeasonModel) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/season/modals/create-season-duplicate-error/create-season-duplicate-error.tpl.html',
			'season.modals.createSeasonDuplicateError.ctrl',
			{
				season: function() {
					return seasonModel;
				}
			}
		);

		modalInstance.result.then(function(createdSeason) {
			console.log(createdSeason);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});
		return d.promise;
	}
	
	this.deleteSeason = function(season: Season.Models.SeasonModel) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/season/modals/delete-season/delete-season.tpl.html',
			'season.modals.deleteSeason.ctrl',
			{
				season: function() {
					return season;
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
	
	this.saveSeason = function(season: Season.Models.SeasonModel) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/season/modals/save-season/save-season.tpl.html',
			'season.modals.saveSeason.ctrl',
			{
				season: function() {
					return season;
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
	 * GAME
	 * 
	 */
	this.createGame = function(season?: Season.Models.SeasonModel, week?: Season.Models.Week) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/season/modals/create-game/create-game.tpl.html',
			'season.modals.createGame.ctrl',
			{
				season: function() {
					return season;
				},
				week: function() {
					return week;
				}
			}
		);

		modalInstance.result.then(function(createdGame: Season.Models.Game) {
			console.log(createdGame);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createGameDuplicate = function(game: Season.Models.Game) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/season/modals/create-game-duplicate-error/create-game-duplicate-error.tpl.html',
			'season.modals.createGameDuplicateError.ctrl',
			{
				game: function() {
					return game;
				}
			}
		);

		modalInstance.result.then(function(createdGame) {
			console.log(createdGame);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deleteGame = function(game: Season.Models.Game) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/season/modals/delete-game/delete-game.tpl.html',
			'season.modals.deleteGame.ctrl',
			{
				game: function() {
					return game;
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
	
	this.saveGame = function(game: Season.Models.Game) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/season/modals/save-game/save-game.tpl.html',
			'season.modals.saveGame.ctrl',
			{
				game: function() {
					return game;
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
	 * WEEK
	 * 
	 */
	this.createWeek = function(game?: Season.Models.Game) {
		let d = $q.defer();

		let modalInstance = __modals.open(
			'',
			'modules/season/modals/create-week/create-week.tpl.html',
			'season.modals.createWeek.ctrl',
			{
				game: function() {
					return game;
				}
			}
		);

		modalInstance.result.then(function(createdWeek: Season.Models.Week) {
			console.log(createdWeek);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	this.createWeekDuplicate = function(week: Season.Models.Week) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/season/modals/create-week-duplicate-error/create-week-duplicate-error.tpl.html',
			'season.modals.createWeekDuplicateError.ctrl',
			{
				week: function() {
					return week;
				}
			}
		);

		modalInstance.result.then(function(createdWeek) {
			console.log(createdWeek);
			d.resolve();
		}, function(results) {
			console.log('dismissed');
			d.reject();
		});

		return d.promise;
	}
	
	this.deleteWeek = function(week: Season.Models.Week) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/season/modals/delete-week/delete-week.tpl.html',
			'season.modals.deleteWeek.ctrl',
			{
				week: function() {
					return week;
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
	
	this.saveWeek = function(week: Season.Models.Week) {
		let d = $q.defer();
		let modalInstance = __modals.open(
			'',
			'modules/season/modals/save-week/save-week.tpl.html',
			'season.modals.saveWeek.ctrl',
			{
				week: function() {
					return week;
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