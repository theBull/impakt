/// <reference path='./models/models.ts' />
/// <reference path='./season.ts' />

// Season service
impakt.season.service('_season', [
'SEASON',
'$rootScope',
'$q',
'$state',
'__api',
'__localStorage',
'__notifications',
'_seasonModals',
function(
    SEASON: any,
    $rootScope: any,
    $q: any,
    $state: any,
    __api: any,
    __localStorage: any,
    __notifications: any,
    _seasonModals: any) {

    var self = this;

    this.drilldown = {
        season: null,
        week: null,
        game: null,
    }

    /**
     * Retrieves all seasons
     */
    this.getSeasons = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting seasons...'
        );

        __api.get(__api.path(SEASON.ENDPOINT, SEASON.GET_SEASONS))
            .then(function(response: any) {

                let collection = new Season.Models.SeasonModelCollection();

                if (response && response.data && response.data.results) {

                    let seasonResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < seasonResults.length; i++) {
                        let seasonResult = seasonResults[i];

                        if (seasonResult && seasonResult.data && seasonResult.data.model) {
                            let seasonModel = new Season.Models.SeasonModel();
                            seasonResult.data.model.key = seasonResult.key;
                            seasonModel.fromJson(seasonResult.data.model);

                            collection.add(seasonModel, false);
                        }
                    }
                }

                notification.success([collection.size(), ' Seasons successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve Seasons');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single season with the given key
     * @param {number} key The key of the season to retrieve
     */
    this.getSeason = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(SEASON.ENDPOINT, SEASON.GET_SEASON, '/' + key))
            .then(function(response: any) {
                let season = Common.Utilities.parseData(response.data.results);

                d.resolve(season);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a season model to the server for storage
     * @param {Common.Models.SeasonModel} seasonModel The model to be created/saved
     */
    this.createSeason = function(newSeasonModel: Season.Models.SeasonModel) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newSeasonModel)) {
            let nameExists = impakt.context.Season.seasons.hasElementWhich(
                function(seasonModel: Season.Models.SeasonModel, index: number) {
                    return seasonModel.name == newSeasonModel.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create season. Season "', newSeasonModel.name, '" already exists.');
                _seasonModals.createSeasonDuplicate(newSeasonModel);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newSeasonModel.key = -1;
        let seasonModelJson = newSeasonModel.toJson();
        let notification = __notifications.pending(
            'Creating season "', newSeasonModel.name, '"...'
        );
        __api.post(
            __api.path(SEASON.ENDPOINT, SEASON.CREATE_SEASON),
            {
                version: 1,
                name: newSeasonModel.name,
                data: {
                    version: 1,
                    model: seasonModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let seasonModel = new Season.Models.SeasonModel();

                if (results && results.data && results.data.model) {
                    results.data.model.key = results.key;
                    seasonModel.fromJson(results.data.model);

                    // update the context
                    impakt.context.Season.seasons.add(seasonModel, false);

                } else {
                    throw new Error('CreateSeason did not return a valid season model');
                }

                notification.success(
                    'Successfully created season "', seasonModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', seasonModel);

                d.resolve(seasonModel);
            }, function(error: any) {
                notification.error('Failed to create season "', newSeasonModel.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given season for the current user
     * @param {Season.Models.SeasonModel} season The season to be deleted
     */
    this.deleteSeason = function(season: Season.Models.SeasonModel) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting season "', season.name, '"...'
        );

        __api.post(
            __api.path(SEASON.ENDPOINT, SEASON.DELETE_SEASON),
            { key: season.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.Season.seasons.remove(season.guid);

            notification.success('Deleted season "', season.name, '"');

            if ($state.is('season.drilldown.season'))
                self.toBrowser();

            d.resolve(season);
        }, function(error: any) {
            notification.error('Failed to delete season "', season.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given season for the current user
     * @param {Season.Models.SeasonModel} season The season to update
     */
    this.updateSeason = function(season: Season.Models.SeasonModel) {
        var d = $q.defer();

        // update assignment collection to json object
        let seasonJson = season.toJson();

        let notification = __notifications.pending('Updating season "', season.name, '"...');

        __api.post(__api.path(
            SEASON.ENDPOINT,
            SEASON.UPDATE_SEASON),
            {
                version: 1,
                name: seasonJson.name,
                key: seasonJson.key,
                data: {
                    version: 1,
                    key: seasonJson.key,
                    model: seasonJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let seasonModel = new Season.Models.SeasonModel();
                if (results && results.data && results.data.model) {
                    seasonModel.fromJson(results.data.model);

                    // update the context
                    impakt.context.Season.seasons.set(seasonModel.guid, seasonModel);
                }

                notification.success('Successfully updated season "', season.name, '"');

                d.resolve(seasonModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update season "', season.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Retrieves all games
     */
    this.getGames = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting games...'
        );

        __api.get(__api.path(SEASON.ENDPOINT, SEASON.GET_GAMES))
            .then(function(response: any) {

                let collection = new Season.Models.GameCollection();

                if (response && response.data && response.data.results) {

                    let gameResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < gameResults.length; i++) {
                        let gameResult = gameResults[i];

                        if (gameResult && gameResult.data && gameResult.data.game) {
                            let gameModel = new Season.Models.Game();
                            gameResult.data.game.key = gameResult.key;
                            gameModel.fromJson(gameResult.data.game);

                            collection.add(gameModel, false);
                        }
                    }
                }

                notification.success([collection.size(), ' Games successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve Games');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single game with the given key
     * @param {number} key The key of the game to retrieve
     */
    this.getGame = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(SEASON.ENDPOINT, SEASON.GET_GAME, '/' + key))
            .then(function(response: any) {
                let game = Common.Utilities.parseData(response.data.results);

                d.resolve(game);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a game model to the server for storage
     * @param {Common.Models.Game} newGame The game to be created/saved
     */
    this.createGame = function(newGame: Season.Models.Game) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newGame)) {
            let nameExists = impakt.context.Season.games.hasElementWhich(
                function(gameModel: Season.Models.Game, index: number) {
                    return gameModel.name == newGame.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create game. Game "', newGame.name, '" already exists.');
                _seasonModals.createGameDuplicate(newGame);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newGame.key = -1;
        let gameModelJson = newGame.toJson();
        let notification = __notifications.pending(
            'Creating game "', newGame.name, '"...'
        );
        __api.post(
            __api.path(SEASON.ENDPOINT, SEASON.CREATE_GAME),
            {
                version: 1,
                name: newGame.name,
                data: {
                    version: 1,
                    game: gameModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let gameModel = new Season.Models.Game();

                if (results && results.data && results.data.game) {
                    results.data.game.key = results.key;
                    gameModel.fromJson(results.data.game);

                    // update the context
                    impakt.context.Season.games.add(gameModel, false);

                } else {
                    throw new Error('CreateGame did not return a valid game');
                }

                notification.success(
                    'Successfully created game "', gameModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', gameModel);

                d.resolve(gameModel);
            }, function(error: any) {
                notification.error('Failed to create game "', newGame.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given game for the current user
     * @param {Season.Models.Game} game The game to be deleted
     */
    this.deleteGame = function(game: Season.Models.Game) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting game "', game.name, '"...'
        );

        __api.post(
            __api.path(SEASON.ENDPOINT, SEASON.DELETE_GAME),
            { key: game.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.Season.games.remove(game.guid);

            notification.success('Deleted game "', game.name, '"');

            d.resolve(game);
        }, function(error: any) {
            notification.error('Failed to delete game "', game.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given game for the current user
     * @param {Season.Models.Game} game The game to update
     */
    this.updateGame = function(game: Season.Models.Game) {
        var d = $q.defer();

        // update assignment collection to json object
        let gameJson = game.toJson();

        let notification = __notifications.pending('Updating game "', game.name, '"...');

        __api.post(__api.path(
            SEASON.ENDPOINT,
            SEASON.UPDATE_GAME),
            {
                version: 1,
                name: gameJson.name,
                key: gameJson.key,
                data: {
                    version: 1,
                    key: gameJson.key,
                    game: gameJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let gameModel = new Season.Models.Game();
                if (results && results.data && results.data.game) {
                    gameModel.fromJson(results.data.game);

                    // update the context
                    impakt.context.Season.games.set(gameModel.guid, gameModel);
                }

                notification.success('Successfully updated game "', game.name, '"');

                d.resolve(gameModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update game "', game.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }

    this.deleteEntityByType = function(entity: Common.Interfaces.IActionable): void {
        if (Common.Utilities.isNullOrUndefined(entity))
            return;

        let d = $q.defer();

        switch(entity.impaktDataType) {
            case Common.Enums.ImpaktDataTypes.Season:
                return _seasonModals.deleteSeason(entity);
            
            case Common.Enums.ImpaktDataTypes.Game:
                return _seasonModals.deleteGame(entity);

            default:
                d.reject(new Error('_season deleteEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise;
    }

    this.updateEntityByType = function(entity: Common.Interfaces.IActionable): void {
        if (Common.Utilities.isNullOrUndefined(entity))
            return;

        let d = $q.defer();

        switch(entity.impaktDataType) {
            case Common.Enums.ImpaktDataTypes.Season:
                return _seasonModals.saveSeason(entity);
            
            case Common.Enums.ImpaktDataTypes.Game:
                return _seasonModals.saveGame(entity);

            default:
                d.reject(new Error('_season saveEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise;
    }

    this.toBrowser = function() {
        this.drilldown.season = null;
        this.drilldown.game = null;
        $state.transitionTo('season.browser');
    }

    this.toSeasonDrilldown = function(season: Season.Models.SeasonModel) {
        this.drilldown.season = season;
        this.drilldown.week = null;
        this.drilldown.game = null;
        impakt.context.Season.seasons.select(season);
        _deselectEntities(false, true);
        impakt.context.Actionable.selected.only(season);
        $state.transitionTo('season.drilldown.season');
    }

    this.toWeekDrilldown = function(week: Season.Models.Week) {
        this.drilldown.week = week;
        this.drilldown.game = null;
        this.drilldown.season.weeks.select(week);
        _deselectEntities(true, true);
        impakt.context.Actionable.selected.only(week);
        $state.transitionTo('season.drilldown.week');
    }

    this.toGameDrilldown = function(game: Season.Models.Game) {
        this.drilldown.game = game;
        impakt.context.Season.games.select(game);
        _deselectEntities(true, false);
        impakt.context.Actionable.selected.only(game);
        $state.transitionTo('season.drilldown.game');
    }

    function _deselectEntities(
        deselectSeasons: boolean,
        deselectGames: boolean
    ) {

        deselectSeasons && impakt.context.Season.seasons.deselectAll();
        deselectGames && impakt.context.Season.games.deselectAll();
    }

}]);