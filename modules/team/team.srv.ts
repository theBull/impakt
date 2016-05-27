/// <reference path='./team.mdl.ts' />

// Team service
impakt.team.service('_team',[
'$rootScope',
'$q', 
'PLAYBOOK', 
'TEAM',
'LEAGUE',
'__api', 
'__notifications',
'_teamModals',
function(
    $rootScope: any,
	$q: any, 
	PLAYBOOK: any, 
	TEAM: any, 
	LEAGUE: any,
	__api: any, 
	__notifications: any,
	_teamModals: any
) {

    this.personnel = null;

    this.initialize = function() {
        this.personnel = impakt.context.Team.personnel
    }

    /**
     * Retrieves all teams
     */
    this.getTeams = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting all league teams...'
        );

        __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_TEAMS))
            .then(function(response: any) {

                let collection = new Team.Models.TeamModelCollection(Team.Enums.TeamTypes.Mixed);

                if (response && response.data && response.data.results) {

                    let teamResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < teamResults.length; i++) {
                        let teamResult = teamResults[i];

                        if (teamResult && teamResult.data && teamResult.data.model) {
                            let teamModel = new Team.Models.TeamModel(teamResult.data.model.teamType);
                            teamResult.data.model.key = teamResult.key;
                            teamModel.fromJson(teamResult.data.model);

                            collection.add(teamModel);
                        }
                    }
                }

                notification.success([collection.size(), ' league teams successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve league teams');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single team with the given key
     * @param {number} key The key of the team to retrieve
     */
    this.getTeam = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_TEAM, '/' + key))
            .then(function(response: any) {
                let team = Common.Utilities.parseData(response.data.results);

                d.resolve(team);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a team model to the server for storage
     * @param {Team.Models.TeamModel} teamModel The model to be created/saved
     */
    this.createTeam = function(newTeamModel: League.Models.LeagueModel) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newTeamModel)) {
            let nameExists = impakt.context.Team.teams.hasElementWhich(
                function(teamModel: Team.Models.TeamModel, index: number) {
                    return teamModel.name == newTeamModel.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create team. Team "', newTeamModel.name, '" already exists.');
                _teamModals.createTeamDuplicate(newTeamModel);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newTeamModel.key = -1;
        let teamModelJson = newTeamModel.toJson();
        let notification = __notifications.pending(
            'Creating playbook "', newTeamModel.name, '"...'
        );
        __api.post(
            __api.path(LEAGUE.ENDPOINT, LEAGUE.CREATE_TEAM),
            {
                version: 1,
                name: newTeamModel.name,
                data: {
                    version: 1,
                    model: teamModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let teamModel = new Team.Models.TeamModel(Team.Enums.TeamTypes.Other);

                if (results && results.data && results.data.model) {
                    results.data.model.key = results.key;
                    teamModel.fromJson(results.data.model);

                    // update the context
                    impakt.context.Team.teams.add(teamModel);

                } else {
                    throw new Error('CreateTeam did not return a valid team model');
                }

                notification.success(
                    'Successfully created team "', teamModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', teamModel);

                d.resolve(teamModel);
            }, function(error: any) {
                notification.error('Failed to create team "', newTeamModel.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given team for the current user
     * @param {Team.Models.TeamModel} team The team to be deleted
     */
    this.deleteTeam = function(team: Team.Models.TeamModel) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting team "', team.name, '"...'
        );

        __api.post(
            __api.path(LEAGUE.ENDPOINT, LEAGUE.DELETE_TEAM),
            { key: team.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.Team.teams.remove(team.guid);

            notification.success('Deleted team "', team.name, '"');

            d.resolve(team);
        }, function(error: any) {
            notification.error('Failed to delete team "', team.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given team for the current user
     * @param {Team.Models.TeamModel} team The team to update
     */
    this.updateTeam = function(team: Team.Models.TeamModel) {
        var d = $q.defer();

        // update assignment collection to json object
        let teamJson = team.toJson();

        let notification = __notifications.pending('Updating team "', team.name, '"...');

        __api.post(__api.path(
            LEAGUE.ENDPOINT,
            LEAGUE.UPDATE_TEAM),
            {
                version: 1,
                name: teamJson.name,
                key: teamJson.key,
                data: {
                    version: 1,
                    key: teamJson.key,
                    model: teamJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let teamModel = new Team.Models.TeamModel(Team.Enums.TeamTypes.Other);
                if (results && results.data && results.data.model) {
                    teamModel.fromJson(results.data.model);

                    // update the context
                    impakt.context.Team.teams.set(teamModel.guid, teamModel);
                }

                notification.success('Successfully updated team "', team.name, '"');

                d.resolve(teamModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update team "', team.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }

    this.getPersonnel = function() {
        var d = $q.defer();

        let personnelNotification = __notifications.pending(
            'Getting Personnel...'
        );

        __api.get(__api.path(
            TEAM.ENDPOINT,
            TEAM.GET_SETS)
        )
            .then(function(response: any) {
                let personnelResults = Common.Utilities.parseData(response.data.results);
                let personnelCollection = new Team.Models.PersonnelCollection(Team.Enums.UnitTypes.Mixed);

                for (let i = 0; i < personnelResults.length; i++) {
                    let results = personnelResults[i];
                    if (results && results.data && results.data.personnel) {
                        let rawPersonnel = results.data.personnel;
                        rawPersonnel.key = results.key;
                        let personnelModel = new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
                        personnelModel.fromJson(rawPersonnel);
                        personnelCollection.add(personnelModel);
                    }
                }

                personnelNotification.success(
                    personnelCollection.size(), ' Personnel groups successfully retrieved'
                );

                d.resolve(personnelCollection);
            }, function(error: any) {
                personnelNotification.error('Failed to retrieve Personnel groups');
                d.reject(error);
            });

        return d.promise;
    }

    this.savePersonnel = function(
    	personnelModel: Team.Models.Personnel,
		createNew?: boolean
    ) {
		let d = $q.defer();
		let result;

		let notification = __notifications.pending('Saving personnel "', personnelModel.name, '"...');
	
		if (createNew) {
			personnelModel.key = 0;
			personnelModel.guid = Common.Utilities.guid();
			result = this.createPersonnel(personnelModel);			
		} else {
			result = this.updatePersonnel(personnelModel);
		}
		result.then(function(results) {
			notification.success('Successfully saved personnel "', personnelModel.name, '"');
			d.resolve(results);
		}, function(err) {
			notification.error('Failed to save personnel "', personnelModel.name, '"');
			d.reject(err);
		});

		return d.promise;
    }

    this.createPersonnel = function(personnelModel: Team.Models.Personnel) {
		let d = $q.defer();
		let personnelJson = personnelModel.toJson();
		let notification = __notifications.pending(
			'Creating personnel group "', personnelModel.name, '"...'
		);
		__api.post(
            __api.path(TEAM.ENDPOINT, TEAM.CREATE_SET),
            {
				version: 1,
				ownerRK: 1,
				parentRK: 1,
				name: personnelJson.name,
				data: {
					setType: Common.Enums.SetTypes.Personnel,
					personnel: personnelJson,
					name: personnelJson.name,
					version: 1,
					ownerRK: 1,
					parentRK: 1
				}
            }
        )
        .then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);

			let personnelModel = new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
			if (results && results.data && results.data.personnel) {
				results.data.personnel.key = results.key;
				personnelModel.fromJson(results.data.personnel);
			}

			impakt.context.Team.personnel.add(personnelModel);

			notification.success(
				'Personnel group "', personnelModel.name, '" successfully created'
			);

            $rootScope.$broadcast('create-entity', personnelModel);

			d.resolve(personnelModel);
        }, function(error: any) {
            d.reject(error);
        });

		return d.promise;
    }

    this.updatePersonnel = function(personnelModel: Team.Models.Personnel) {
		let d = $q.defer();
		let personnelJson = personnelModel.toJson();

		let notification = __notifications.pending('Updating personnel "', personnelModel.name, '"...');

		__api.post(
            __api.path(TEAM.ENDPOINT, TEAM.UPDATE_SET),
            {
				version: 1,
				name: personnelJson.name,
				key: personnelJson.key,
				data: {
					setType: Common.Enums.SetTypes.Personnel,
					personnel: personnelJson,
					name: personnelJson.name,
					key: personnelJson.key,
					version: 1
				}
            }
        ) 
		.then(function(response: any) {
			let results = Common.Utilities.parseData(response.data.results);

			let personnelModel = new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
			if(results && results.data && results.data.personnel) {
				personnelModel.fromJson(results.data.personnel);
			}

			impakt.context.Team.personnel.set(personnelModel.guid, personnelModel);

			notification.success('Successfully updated personnel "', personnelModel.name, '"...');

			d.resolve(personnelModel);
		}, function(error: any) {
			notification.error('Failed to update personnel "', personnelModel.name, '"...');
			d.reject(error);
		});

		return d.promise;
    }

    this.deletePersonnel = function(personnelModel: Team.Models.Personnel) {
		let d = $q.defer();

		let notification = __notifications.pending('Deleting personnel "', personnelModel.name, '"...');

		__api.post(
			__api.path(TEAM.ENDPOINT, TEAM.DELETE_SET), { 
				key: personnelModel.key 
		}).then(function(response: any) {
			impakt.context.Team.personnel.remove(personnelModel.guid);
			notification.success('Successfully saved personnel "', personnelModel.name, '"');
			d.resolve(response);
		}, function(err) {
			notification.error('Failed to save personnel "', personnelModel.name, '"');
			d.reject(err);
		})
		return d.promise;
    }

    this.deleteEntityByType = function(entity: Common.Interfaces.IActionable) {
        if (Common.Utilities.isNullOrUndefined(entity))
            return;

        let d = $q.defer();

        switch(entity.impaktDataType) {
            case Common.Enums.ImpaktDataTypes.Team:
                return _teamModals.deleteTeam(entity);

            case Common.Enums.ImpaktDataTypes.PersonnelGroup:
                // TODO @theBull implement
                //return _teamModals.deletePersonnel(entity);
                d.reject(new Error('_team deleteEntityByType(): _teamModals.deletePersonnel() not implemented'));
                break;

            default:
                d.reject(new Error('_team deleteEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise();
    }

    this.updateEntityByType = function(entity: Common.Interfaces.IActionable) {
        if (Common.Utilities.isNullOrUndefined(entity))
            return;

        let d = $q.defer();

        switch(entity.impaktDataType) {
            case Common.Enums.ImpaktDataTypes.Team:
                return _teamModals.saveTeam(entity);

            case Common.Enums.ImpaktDataTypes.PersonnelGroup:
                return _teamModals.savePersonnel(entity);

            default:
                d.reject(new Error('_team updateEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise();
    }

    this.createPrimaryTeam = function(teamModel: Team.Models.TeamModel) {
    	
    }

    this.updatePrimaryTeam = function(teamModel: Team.Models.TeamModel) {
    	
    }

    this.deletePrimaryTeam = function(teamModel: Team.Models.TeamModel) {
    	
    }

    this.savePrimaryTeam = function(teamModel: Team.Models.TeamModel) {

    }

}]);