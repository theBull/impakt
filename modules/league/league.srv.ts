/// <reference path='./models/models.ts' />
/// <reference path='./league.ts' />

// League service
impakt.league.service('_league', [
'LEAGUE',
'$rootScope',
'$q',
'$state',
'__api',
'__localStorage',
'__notifications',
'_leagueModals',
function(
    LEAGUE: any,
    $rootScope: any,
    $q: any,
    $state: any,
    __api: any,
    __localStorage: any,
    __notifications: any,
    _leagueModals: any) {

    var self = this;

    this.drilldown = {
        league: null,
        conference: null,
        division: null,
        team: null
    }

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
            'Creating league "', newLeagueModel.name, '"...'
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

                $rootScope.$broadcast('create-entity', leagueModel);

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

            if ($state.is('league.drilldown.league'))
                self.toBrowser();

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

    /**
     * Retrieves all conferences
     */
    this.getConferences = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting conferences...'
        );

        __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_CONFERENCES))
            .then(function(response: any) {

                let collection = new League.Models.ConferenceCollection();

                if (response && response.data && response.data.results) {

                    let conferenceResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < conferenceResults.length; i++) {
                        let conferenceResult = conferenceResults[i];

                        if (conferenceResult && conferenceResult.data && conferenceResult.data.conference) {
                            let conferenceModel = new League.Models.Conference();
                            conferenceResult.data.conference.key = conferenceResult.key;
                            conferenceModel.fromJson(conferenceResult.data.conference);

                            collection.add(conferenceModel);
                        }
                    }
                }

                notification.success([collection.size(), ' Conferences successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve Conferences');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single conference with the given key
     * @param {number} key The key of the conference to retrieve
     */
    this.getConference = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_CONFERENCE, '/' + key))
            .then(function(response: any) {
                let conference = Common.Utilities.parseData(response.data.results);

                d.resolve(conference);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a conference model to the server for storage
     * @param {Common.Models.Conference} newConference The conference to be created/saved
     */
    this.createConference = function(newConference: League.Models.Conference) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newConference)) {
            let nameExists = impakt.context.League.conferences.hasElementWhich(
                function(conferenceModel: League.Models.Conference, index: number) {
                    return conferenceModel.name == newConference.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create conference. Conference "', newConference.name, '" already exists.');
                _leagueModals.createConferenceDuplicate(newConference);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newConference.key = -1;
        let conferenceModelJson = newConference.toJson();
        let notification = __notifications.pending(
            'Creating conference "', newConference.name, '"...'
        );
        __api.post(
            __api.path(LEAGUE.ENDPOINT, LEAGUE.CREATE_CONFERENCE),
            {
                version: 1,
                name: newConference.name,
                data: {
                    version: 1,
                    conference: conferenceModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let conferenceModel = new League.Models.Conference();

                if (results && results.data && results.data.conference) {
                    results.data.conference.key = results.key;
                    conferenceModel.fromJson(results.data.conference);

                    // update the context
                    impakt.context.League.conferences.add(conferenceModel);

                } else {
                    throw new Error('CreateConference did not return a valid conference');
                }

                notification.success(
                    'Successfully created conference "', conferenceModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', conferenceModel);

                d.resolve(conferenceModel);
            }, function(error: any) {
                notification.error('Failed to create conference "', newConference.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given conference for the current user
     * @param {League.Models.Conference} conference The conference to be deleted
     */
    this.deleteConference = function(conference: League.Models.Conference) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting conference "', conference.name, '"...'
        );

        __api.post(
            __api.path(LEAGUE.ENDPOINT, LEAGUE.DELETE_CONFERENCE),
            { key: conference.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.League.conferences.remove(conference.guid);

            notification.success('Deleted conference "', conference.name, '"');

            d.resolve(conference);
        }, function(error: any) {
            notification.error('Failed to delete conference "', conference.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given conference for the current user
     * @param {League.Models.Conference} conference The conference to update
     */
    this.updateConference = function(conference: League.Models.Conference) {
        var d = $q.defer();

        // update assignment collection to json object
        let conferenceJson = conference.toJson();

        let notification = __notifications.pending('Updating conference "', conference.name, '"...');

        __api.post(__api.path(
            LEAGUE.ENDPOINT,
            LEAGUE.UPDATE_CONFERENCE),
            {
                version: 1,
                name: conferenceJson.name,
                key: conferenceJson.key,
                data: {
                    version: 1,
                    key: conferenceJson.key,
                    conference: conferenceJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let conferenceModel = new League.Models.Conference();
                if (results && results.data && results.data.conference) {
                    conferenceModel.fromJson(results.data.conference);

                    // update the context
                    impakt.context.League.conferences.set(conferenceModel.guid, conferenceModel);
                }

                notification.success('Successfully updated conference "', conference.name, '"');

                d.resolve(conferenceModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update conference "', conference.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Retrieves all divisions
     */
    this.getDivisions = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting divisions...'
        );

        __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_DIVISIONS))
            .then(function(response: any) {

                let collection = new League.Models.DivisionCollection();

                if (response && response.data && response.data.results) {

                    let divisionResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < divisionResults.length; i++) {
                        let divisionResult = divisionResults[i];

                        if (divisionResult && divisionResult.data && divisionResult.data.division) {
                            let divisionModel = new League.Models.Division();
                            divisionResult.data.division.key = divisionResult.key;
                            divisionModel.fromJson(divisionResult.data.division);

                            collection.add(divisionModel);
                        }
                    }
                }

                notification.success([collection.size(), ' Divisions successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve Divisions');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single division with the given key
     * @param {number} key The key of the division to retrieve
     */
    this.getDivision = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_DIVISION, '/' + key))
            .then(function(response: any) {
                let division = Common.Utilities.parseData(response.data.results);

                d.resolve(division);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a division model to the server for storage
     * @param {Common.Models.Division} newDivision The division to be created/saved
     */
    this.createDivision = function(newDivision: League.Models.Division) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newDivision)) {
            let nameExists = impakt.context.League.divisions.hasElementWhich(
                function(divisionModel: League.Models.Division, index: number) {
                    return divisionModel.name == newDivision.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create division. Division "', newDivision.name, '" already exists.');
                _leagueModals.createDivisionDuplicate(newDivision);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newDivision.key = -1;
        let divisionModelJson = newDivision.toJson();
        let notification = __notifications.pending(
            'Creating division "', newDivision.name, '"...'
        );
        __api.post(
            __api.path(LEAGUE.ENDPOINT, LEAGUE.CREATE_DIVISION),
            {
                version: 1,
                name: newDivision.name,
                data: {
                    version: 1,
                    division: divisionModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let divisionModel = new League.Models.Division();

                if (results && results.data && results.data.division) {
                    results.data.division.key = results.key;
                    divisionModel.fromJson(results.data.division);

                    // update the context
                    impakt.context.League.divisions.add(divisionModel);

                } else {
                    throw new Error('CreateDivision did not return a valid division');
                }

                notification.success(
                    'Successfully created division "', divisionModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', divisionModel);

                d.resolve(divisionModel);
            }, function(error: any) {
                notification.error('Failed to create division "', newDivision.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given division for the current user
     * @param {League.Models.Division} division The division to be deleted
     */
    this.deleteDivision = function(division: League.Models.Division) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting division "', division.name, '"...'
        );

        __api.post(
            __api.path(LEAGUE.ENDPOINT, LEAGUE.DELETE_DIVISION),
            { key: division.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.League.divisions.remove(division.guid);

            notification.success('Deleted division "', division.name, '"');

            d.resolve(division);
        }, function(error: any) {
            notification.error('Failed to delete division "', division.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given division for the current user
     * @param {League.Models.Division} division The division to update
     */
    this.updateDivision = function(division: League.Models.Division) {
        var d = $q.defer();

        // update assignment collection to json object
        let divisionJson = division.toJson();

        let notification = __notifications.pending('Updating division "', division.name, '"...');

        __api.post(__api.path(
            LEAGUE.ENDPOINT,
            LEAGUE.UPDATE_DIVISION),
            {
                version: 1,
                name: divisionJson.name,
                key: divisionJson.key,
                data: {
                    version: 1,
                    key: divisionJson.key,
                    division: divisionJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let divisionModel = new League.Models.Division();
                if (results && results.data && results.data.division) {
                    divisionModel.fromJson(results.data.division);

                    // update the context
                    impakt.context.League.divisions.set(divisionModel.guid, divisionModel);
                }

                notification.success('Successfully updated division "', division.name, '"');

                d.resolve(divisionModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update division "', division.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }


    /**
     * Retrieves all locations
     */
    this.getLocations = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting locations...'
        );

        __api.get(__api.path(LEAGUE.GENERAL_ENDPOINT, LEAGUE.GET_LOCATIONS))
            .then(function(response: any) {

                let collection = new League.Models.LocationCollection();

                if (response && response.data && response.data.results) {

                    let locationResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < locationResults.length; i++) {
                        let locationResult = locationResults[i];

                        if (locationResult && locationResult.data && locationResult.data.location) {
                            let locationModel = new League.Models.Location();
                            locationResult.data.location.key = locationResult.key;
                            locationModel.fromJson(locationResult.data.location);

                            collection.add(locationModel);
                        }
                    }
                }

                notification.success([collection.size(), ' Locations successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve Locations');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single location with the given key
     * @param {number} key The key of the location to retrieve
     */
    this.getLocation = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(LEAGUE.GENERAL_ENDPOINT, LEAGUE.GET_LOCATION, '/' + key))
            .then(function(response: any) {
                let location = Common.Utilities.parseData(response.data.results);

                d.resolve(location);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a location model to the server for storage
     * @param {Common.Models.Location} newLocation The location to be created/saved
     */
    this.createLocation = function(newLocation: League.Models.Location) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newLocation)) {
            let nameExists = impakt.context.League.locations.hasElementWhich(
                function(locationModel: League.Models.Location, index: number) {
                    return locationModel.name == newLocation.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create location. Location "', newLocation.name, '" already exists.');
                _leagueModals.createLocationDuplicate(newLocation);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newLocation.key = -1;
        let locationModelJson = newLocation.toJson();
        let notification = __notifications.pending(
            'Creating location "', newLocation.name, '"...'
        );
        __api.post(
            __api.path(LEAGUE.GENERAL_ENDPOINT, LEAGUE.CREATE_LOCATION),
            {
                version: 1,
                name: newLocation.name,
                data: {
                    version: 1,
                    location: locationModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let locationModel = new League.Models.Location();

                if (results && results.data && results.data.location) {
                    results.data.location.key = results.key;
                    locationModel.fromJson(results.data.location);

                    // update the context
                    impakt.context.League.locations.add(locationModel);

                } else {
                    throw new Error('CreateLocation did not return a valid location');
                }

                notification.success(
                    'Successfully created location "', locationModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', locationModel);

                d.resolve(locationModel);
            }, function(error: any) {
                notification.error('Failed to create location "', newLocation.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given location for the current user
     * @param {League.Models.Location} location The location to be deleted
     */
    this.deleteLocation = function(location: League.Models.Location) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting location "', location.name, '"...'
        );

        __api.post(
            __api.path(LEAGUE.GENERAL_ENDPOINT, LEAGUE.DELETE_LOCATION),
            { key: location.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.League.locations.remove(location.guid);

            notification.success('Deleted location "', location.name, '"');

            d.resolve(location);
        }, function(error: any) {
            notification.error('Failed to delete location "', location.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given location for the current user
     * @param {League.Models.Location} location The location to update
     */
    this.updateLocation = function(location: League.Models.Location) {
        var d = $q.defer();

        // update assignment collection to json object
        let locationJson = location.toJson();

        let notification = __notifications.pending('Updating location "', location.name, '"...');

        __api.post(__api.path(
            LEAGUE.GENERAL_ENDPOINT,
            LEAGUE.UPDATE_LOCATION),
            {
                version: 1,
                name: locationJson.name,
                key: locationJson.key,
                data: {
                    version: 1,
                    key: locationJson.key,
                    location: locationJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let locationModel = new League.Models.Location();
                if (results && results.data && results.data.location) {
                    locationModel.fromJson(results.data.location);

                    // update the context
                    impakt.context.League.locations.set(locationModel.guid, locationModel);
                }

                notification.success('Successfully updated location "', location.name, '"');

                d.resolve(locationModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update location "', location.name, '"'
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
            case Common.Enums.ImpaktDataTypes.League:
                return _leagueModals.deleteLeague(entity);
            
            case Common.Enums.ImpaktDataTypes.Conference:
                return _leagueModals.deleteConference(entity);

            case Common.Enums.ImpaktDataTypes.Division:
                return _leagueModals.deleteDivision(entity);

            default:
                d.reject(new Error('_league deleteEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise;
    }

    this.updateEntityByType = function(entity: Common.Interfaces.IActionable): void {
        if (Common.Utilities.isNullOrUndefined(entity))
            return;

        let d = $q.defer();

        switch(entity.impaktDataType) {
            case Common.Enums.ImpaktDataTypes.League:
                return _leagueModals.saveLeague(entity);
            
            case Common.Enums.ImpaktDataTypes.Conference:
                return _leagueModals.saveConference(entity);

            case Common.Enums.ImpaktDataTypes.Division:
                return _leagueModals.saveDivision(entity);

            default:
                d.reject(new Error('_league saveEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise;
    }

    this.toBrowser = function() {
        this.drilldown.league = null;
        this.drilldown.team = null;
        $state.transitionTo('league.browser');
    }

    this.toLeagueDrilldown = function(league: League.Models.LeagueModel) {
        this.drilldown.league = league;
        this.drilldown.conference = null;
        this.drilldown.division = null;
        this.drilldown.team = null;
        impakt.context.League.leagues.select(league);
        _deselectEntities(false, true, true, true);
        impakt.context.Actionable.selected.only(league);
        $state.transitionTo('league.drilldown.league');
    }

    this.toConferenceDrilldown = function(conference: League.Models.Conference) {
        this.drilldown.conference = conference;
        this.drilldown.division = null;
        this.drilldown.team = null;
        impakt.context.League.conferences.select(conference);
        _deselectEntities(true, false, true, true);
        impakt.context.Actionable.selected.only(conference);
        $state.transitionTo('league.drilldown.conference');
    }

    this.toDivisionDrilldown = function(division: League.Models.Division) {
        this.drilldown.division = division;
        this.drilldown.team = null;
        impakt.context.League.divisions.select(division);
        _deselectEntities(true, true, false, true);
        impakt.context.Actionable.selected.only(division);
        $state.transitionTo('league.drilldown.division');
    }

    this.toTeamDrilldown = function(team: Team.Models.TeamModel) {
        this.drilldown.team = team;
        impakt.context.Team.teams.select(team);
        _deselectEntities(true, true, true, false);
        impakt.context.Actionable.selected.only(team);
        $state.transitionTo('league.drilldown.team');
    }

    function _deselectEntities(
        deselectLeagues: boolean,
        deselectConferences: boolean,
        deselectDivisions: boolean,
        deselectTeam: boolean
    ) {

        deselectLeagues && impakt.context.League.leagues.deselectAll();
        deselectConferences && impakt.context.League.conferences.deselectAll();
        deselectDivisions && impakt.context.League.divisions.deselectAll();
        deselectTeam && impakt.context.Team.teams.deselectAll();
    }

}]);