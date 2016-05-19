/// <reference path='./models/models.ts' />
/// <reference path='./league.ts' />

// League service
impakt.league.service('_league', [
'LEAGUE',
'$q',
'$state',
'__api',
'__localStorage',
'__notifications',
'_leagueModals',
function(
    LEAGUE: any,
    $q: any,
    $state: any,
    __api: any,
    __localStorage: any,
    __notifications: any,
    _leagueModals: any) {

    var self = this;

    this.drilldown = {
        league: null,
        team: null
    }

    // TODO @theBull - ensure the 'current user' is being addressed
    // TODO @theBull - add notification handling

    /**
     * Retrieves all leagues
     */
    this.getLeagues = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting leagues...'
        );

        __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_LEAGUES))
            .then(function(response: any) {

                let collection = new League.Models.LeagueModelCollection();

                if (response && response.data && response.data.results) {

                    let leagueResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < leagueResults.length; i++) {
                        let leagueResult = leagueResults[i];

                        if (leagueResult && leagueResult.data && leagueResult.data.model) {
                            let leagueModel = new League.Models.LeagueModel();
                            leagueResult.data.model.key = leagueResult.key;
                            leagueModel.fromJson(leagueResult.data.model);

                            collection.add(leagueModel);
                        }
                    }
                }

                notification.success([collection.size(), ' Leagues successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve Leagues');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single league with the given key
     * @param {number} key The key of the league to retrieve
     */
    this.getLeague = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_LEAGUE, '/' + key))
            .then(function(response: any) {
                let league = Common.Utilities.parseData(response.data.results);

                d.resolve(league);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a league model to the server for storage
     * @param {Common.Models.LeagueModel} leagueModel The model to be created/saved
     */
    this.createLeague = function(newLeagueModel: League.Models.LeagueModel) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newLeagueModel)) {
            let nameExists = impakt.context.League.leagues.hasElementWhich(
                function(leagueModel: League.Models.LeagueModel, index: number) {
                    return leagueModel.name == newLeagueModel.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create league. League "', newLeagueModel.name, '" already exists.');
                _leagueModals.createLeagueDuplicate(newLeagueModel);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newLeagueModel.key = -1;
        let leagueModelJson = newLeagueModel.toJson();
        let notification = __notifications.pending(
            'Creating playbook "', newLeagueModel.name, '"...'
        );
        __api.post(
            __api.path(LEAGUE.ENDPOINT, LEAGUE.CREATE_LEAGUE),
            {
                version: 1,
                name: newLeagueModel.name,
                data: {
                    version: 1,
                    model: leagueModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let leagueModel = new League.Models.LeagueModel();

                if (results && results.data && results.data.model) {
                    results.data.model.key = results.key;
                    leagueModel.fromJson(results.data.model);

                    // update the context
                    impakt.context.League.leagues.add(leagueModel);

                } else {
                    throw new Error('CreateLeague did not return a valid league model');
                }

                notification.success(
                    'Successfully created league "', leagueModel.name, '"'
                );

                d.resolve(leagueModel);
            }, function(error: any) {
                notification.error('Failed to create league "', newLeagueModel.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given league for the current user
     * @param {League.Models.LeagueModel} league The league to be deleted
     */
    this.deleteLeague = function(league: League.Models.LeagueModel) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting league "', league.name, '"...'
        );

        __api.post(
            __api.path(LEAGUE.ENDPOINT, LEAGUE.DELETE_LEAGUE),
            { key: league.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.League.leagues.remove(league.guid);

            notification.success('Deleted league "', league.name, '"');

            d.resolve(league);
        }, function(error: any) {
            notification.error('Failed to delete league "', league.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given league for the current user
     * @param {League.Models.LeagueModel} league The league to update
     */
    this.updateLeague = function(league: League.Models.LeagueModel) {
        var d = $q.defer();

        // update assignment collection to json object
        let leagueJson = league.toJson();

        let notification = __notifications.pending('Updating league "', league.name, '"...');

        __api.post(__api.path(
            LEAGUE.ENDPOINT,
            LEAGUE.UPDATE_LEAGUE),
            {
                version: 1,
                name: leagueJson.name,
                key: leagueJson.key,
                data: {
                    version: 1,
                    key: leagueJson.key,
                    model: leagueJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let leagueModel = new League.Models.LeagueModel();
                if (results && results.data && results.data.model) {
                    leagueModel.fromJson(results.data.model);

                    // update the context
                    impakt.context.League.leagues.set(leagueModel.guid, leagueModel);
                }

                notification.success('Successfully updated league "', league.name, '"');

                d.resolve(leagueModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update league "', league.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }

    this.toBrowser = function() {
        this.drilldown.league = null;
        this.drilldown.team = null;
        $state.transitionTo('league.browser');
    }

    this.toLeagueDrilldown = function(league: League.Models.LeagueModel) {
        this.drilldown.league = league;
        $state.transitionTo('league.drilldown.league');
    }

    this.toTeamDrilldown = function(team: Team.Models.TeamModel) {
        this.drilldown.team = team;
        $state.transitionTo('league.drilldown.team');
    }

}]);