/// <reference path='./models/models.ts' />
/// <reference path='./playbook.ts' />

// Playbook service
impakt.playbook.service('_playbook',
[
'PLAYBOOK',
'$rootScope',
'$q', 
'$state',
'__api',
'__localStorage',
'__notifications',
'_associations',
'_playbookModals',
function(
    PLAYBOOK: any,
    $rootScope: any,
    $q: any,
    $state: any,
    __api: any,
    __localStorage: any,
    __notifications: any,
    _associations: any,
    _playbookModals: any) {

    var self = this;

    this.drilldown = {
        playbook: null
    }

    // TODO @theBull - ensure the 'current user' is being addressed
    // TODO @theBull - add notification handling

    /**
     * Retrieves all playbooks for the current user
     */
    this.getPlaybooks = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting playbooks...'
        );

        __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOKS))
            .then(function(response: any) {

                let collection = new Common.Models.PlaybookModelCollection(Team.Enums.UnitTypes.Mixed);

                if (response && response.data && response.data.results) {

                    let playbookResults = Common.Utilities.parseData(response.data.results);
                    

                    for (let i = 0; i < playbookResults.length; i++) {
                        let playbookResult = playbookResults[i];

                        if (playbookResult && playbookResult.data && playbookResult.data.model) {
                            let playbookModel = new Common.Models.PlaybookModel(Team.Enums.UnitTypes.Other);
                            playbookResult.data.model.key = playbookResult.key;
                            playbookModel.fromJson(playbookResult.data.model);

                            collection.add(playbookModel, false);
                        }
                    }
                }

                notification.success([collection.size(), ' Playbooks successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve Playbooks');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single playbook with the given key
     * @param {number} key The key of the playbook to retrieve
     */
    this.getPlaybook = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOK, '/' + key))
            .then(function(response: any) {
                let playbook = Common.Utilities.parseData(response.data.results);

                d.resolve(playbook);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a playbook model to the server for storage
     * @param {Common.Models.PlaybookModel} playbookModel The model to be created/saved
     */
    this.createPlaybook = function(newPlaybookModel: Common.Models.PlaybookModel) {
        var d = $q.defer();

        if(Common.Utilities.isNotNullOrUndefined(newPlaybookModel)) {
            let nameExists = impakt.context.Playbook.playbooks.hasElementWhich(
                function(playbookModel: Common.Models.PlaybookModel, index: number) {
                    return playbookModel.name == newPlaybookModel.name;
                });
            if(nameExists) {
                let notification = __notifications.warning(
                    'Failed to create playbook. Playbook "', newPlaybookModel.name, '" already exists.');
                _playbookModals.createPlaybookDuplicate(newPlaybookModel);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newPlaybookModel.key = -1;
        let playbookModelJson = newPlaybookModel.toJson();
        let notification = __notifications.pending(
            'Creating playbook "', newPlaybookModel.name, '"...'
        );
        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_PLAYBOOK),
            {
                version: 1,
                name: newPlaybookModel.name,
                data: {
                    version: 1,
                    model: playbookModelJson
                }
            }
        )
        .then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);
            let playbookModel = new Common.Models.PlaybookModel(newPlaybookModel.unitType);
            
            if(results && results.data && results.data.model) {
                results.data.model.key = results.key;
                playbookModel.fromJson(results.data.model);

                // update the context
                impakt.context.Playbook.playbooks.add(playbookModel, false);

            } else {
                throw new Error('CreatePlaybook did not return a valid playbook model');
            }

            notification.success(
                'Successfully created playbook "', playbookModel.name, '"'
            );

            $rootScope.$broadcast('create-entity', playbookModel);
            
            d.resolve(playbookModel);
        }, function(error: any) {
            notification.error('Failed to create playbook "', newPlaybookModel.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Deletes the given playbook for the current user
     * @param {Common.Models.PlaybookModel} playbook The playbook to be deleted
     */
    this.deletePlaybook = function(playbook: Common.Models.PlaybookModel) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting playbook "', playbook.name, '"...'
        );

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_PLAYBOOK),
            {key: playbook.key}
        ).then(function(response: any) {
            // update the context
            impakt.context.Playbook.playbooks.remove(playbook.guid);

            notification.success('Deleted playbook "', playbook.name, '"');

            _associations.deleteAssociations(playbook.associationKey);

            d.resolve(playbook);
        }, function(error: any) {
            notification.error('Failed to delete playbook "', playbook.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given playbook for the current user
     * @param {Common.Models.Playbook} playbook The playbook to update
     */
    this.updatePlaybook = function(playbook: Common.Models.PlaybookModel) {
        var d = $q.defer();

        let notification = __notifications.pending('Updating playbook "', playbook.name, '"...');

        let playbookData = playbook.toJson();

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_PLAYBOOK),
            {
                version: 1,
                name: playbook.name,
                key: playbook.key,
                data: {
                    version: 1,
                    name: playbook.name,
                    key: playbook.key,
                    model: playbookData
                }
            }
        ).then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);
            let playbookModel = new Common.Models.PlaybookModel(Team.Enums.UnitTypes.Other);
            if (results && results.data && results.data.model) {
                playbookModel.fromJson(results.data.model);

                // update the context
                impakt.context.Playbook.playbooks.set(playbookModel.guid, playbookModel);
            }

            notification.success('Successfully updated playbook "', playbookModel.name, '"');

            d.resolve(playbookModel);
        }, function(error: any) {
            notification.error(
                'Failed to update playbook "', playbook.name, '"'
            );

            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Creates the given formation for the current user
     * @param {Common.Models.Formation} newFormation The formation to be created
     */
    this.createFormation = function(newFormation: Common.Models.Formation) {
        var d = $q.defer();

        if(newFormation.key > 0) {
            throw new Error(
                'The formation you are trying to create already exists (key > 0) key: '
                + newFormation.key
            );
        }

        let notification = __notifications.pending(
            'Creating formation "', newFormation.name, '"...'
        );

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_FORMATION),
            {
                version: 1,
                name: newFormation.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: newFormation.name,
                    ownerRK: 1,
                    parentRK: 1,
                    formation: newFormation.toJson()
                }
            })
            .then(function(response: any) {
                let result = Common.Utilities.parseData(response.data.results);
                
                if (!result || !result.data || !result.data.formation) {
                    d.reject('Create playbook result was invalid');
                }
                let formationModel = new Common.Models.Formation(Team.Enums.UnitTypes.Other);
                result.data.formation.key = result.key;
                formationModel.fromJson(result.data.formation);
                console.log(formationModel);

                impakt.context.Playbook.formations.add(formationModel, false);

                notification.success(
                    'Successfully created formation "', formationModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', formationModel);

                d.resolve(formationModel);
            }, function(error: any) {
                notification.error(
                    'Failed to create formation "', newFormation.name, '"'
                );
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given formation for the current user
     * @param {Common.Models.Formation} formation The formation to be deleted
     */
    this.deleteFormation = function(formation: Common.Models.Formation) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting formation "', formation.name, '"...'
        );

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_FORMATION),
            {
                key: formation.key
            }
        )
            .then(function(response: any) {
                let formationKey = response.data.results.key;

                // TODO @theBull
                // Deleting a formation will adversely impakt all plays that are
                // associated with that formation...How do we handle this?
                
                // update the context
                impakt.context.Playbook.formations.remove(formation.guid);

                notification.success(
                    'Successfully deleted formation "', formation.name, '"'
                );

                $rootScope.$broadcast('delete-formation', formation);

                _associations.deleteAssociations(formation.associationKey);
                
                d.resolve(formationKey);
            }, function(error: any) {
                notification.error(
                    'Failed to delete formation "', formation.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Retrieves all formations for the current user
     */
    this.getFormations = function() {

        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting Formations...'
        );

        __api.get(__api.path(
            PLAYBOOK.ENDPOINT,
            PLAYBOOK.GET_FORMATIONS,
            '?$filter=ParentRK gt 0'))
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let formationCollection = new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed);
                for (let i = 0; i < results.length; i++) {
                    let result = results[i];
                    if (result && result.data && result.data.formation) {
                        
                        let rawFormation = result.data.formation;
                        rawFormation.key = result.key;
                        let formationModel = new Common.Models.Formation(Team.Enums.UnitTypes.Other);
                        formationModel.fromJson(rawFormation);
                        formationCollection.add(formationModel, false);
                    } else {
                        throw new Error('An invalid formation was retrieved');
                    }
                }

                notification.success(formationCollection.size(), ' Formations successfully retrieved');

                d.resolve(formationCollection);

            }, function(error: any) {
                notification.error('Failed to retrieve Formations');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Retrieves the formation with the given key for the current user
     * @param {[type]} key The key to retrieve
     */
    this.getFormation = function(key: number) {
        var d = $q.defer();

        __api.get(
            __api.path(
                PLAYBOOK.ENDPOINT,
                PLAYBOOK.GET_FORMATION,
                '?Key=' + key
            ))
            .then(function(response: any) {
                let rawResults = Common.Utilities.parseData(response.data.results);
                let formationRaw = (JSON.parse(rawResults.data)).formation;

                let formationModel = new Common.Models.Formation(Team.Enums.UnitTypes.Other);
                formationModel.fromJson(formationRaw);

                d.resolve(formationModel);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    this.newFormation = function() {

    }

    /**
     * Opens the given formation for editing / navigates to the play editor
     * @param {Common.Models.Formation} formation The formation to be edited
     */
    this.editFormation = function(formation: Common.Models.Formation, forceOpen?: boolean) {
        let notification = __notifications.info('Opened formation "', formation.name, '" for editing.');

        // determine whether the formation is already open            
        let formationOpen = forceOpen ? forceOpen : impakt.context.Playbook.editor.scenarios.hasElementWhich(
            function(scenario: Common.Models.Scenario) {
                if (Common.Utilities.isNullOrUndefined(scenario.playPrimary) ||
                    Common.Utilities.isNullOrUndefined(scenario.playPrimary.formation))
                    return false;

                return scenario.editorType == Playbook.Enums.EditorTypes.Formation &&
                    scenario.playPrimary.formation.guid == formation.guid;
            });

        if(!formationOpen) {
            // formation isn't opened yet,
            // 1. create new scenario / primary play for the formation to sit in
            // 2. create a working copy of the formation
            // 3. update the working copy's properties accordingly
            // 4. add the working play to the editor context
        
            // Set Play to formation-only editing mode
            let primaryPlay = new Common.Models.PlayPrimary(formation.unitType);

            // need to make a copy of the formation here
            let formationCopy = formation.copy();
            primaryPlay.setFormation(formationCopy);
            primaryPlay.name = formation.name;

            // Set association data
			this.setFormationAssociations(primaryPlay);

            let scenario = new Common.Models.Scenario();
            scenario.setPlayPrimary(primaryPlay);
            scenario.setPlayOpponent(null);
            scenario.editorType = Playbook.Enums.EditorTypes.Formation;
            scenario.name = formation.name;

            // add the play onto the editor context
            impakt.context.Playbook.editor.scenarios.add(scenario, false);
        }

        // navigate to playbook editor
        //if(!$state.is('playbook.editor'))
        $state.transitionTo('playbook.editor');        
    }

    /**
     * Updates the given formation for the current user
     * @param {Common.Models.Formation} formation The formation to update
     */
    this.updateFormation = function(formation: Common.Models.Formation) {
        var d = $q.defer();

        // update assignment collection to json object
        let formationData = formation.toJson();

        let notification = __notifications.pending('Updating formation');

        __api.post(__api.path(
            PLAYBOOK.ENDPOINT,
            PLAYBOOK.UPDATE_FORMATION),
            {
                version: 1,
                name: formationData.name,
                key: formationData.key,
                data: {
                    version: 1,
                    name: formationData.name,
                    key: formationData.key,
                    formation: formationData
                }
            }
        )
        .then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);
            let formationModel = new Common.Models.Formation(Team.Enums.UnitTypes.Other);
            if(results && results.data && results.data.formation) {
                formationModel.fromJson(results.data.formation);

                // update the context
                impakt.context.Playbook.formations.set(formationModel.guid, formationModel);
            }

            notification.success('Successfully updated formation "', formation.name, '"');

            d.resolve(formationModel);
        }, function(error: any) {
            notification.error(
                'Failed to update formation "', formation.name, '"'
            );

            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Saves the given formation according to the options passed for the given user
     * TODO @theBull create Options model
     *
     * @param {Common.Models.Formation} formation    Formation to save
     * @param {any}                  options Save options
     */
    this.saveFormation = function(formation: Common.Models.Formation, options: any) {
        var d = $q.defer();

        let notification = __notifications.pending('Saving formation "', formation.name, '"...');

        if(options.formation.action == Common.API.Actions.Create || 
            options.formation.action == Common.API.Actions.Copy) {
            
                // ensure formation has no key
                formation.key = -1;
                // ensure formation has a unique guid
                formation.guid = Common.Utilities.guid();
                
                self.createFormation(formation)
                .then(function(createdFormation: Common.Models.Formation) {
                    notification.success(
                        'Successfully created and saved formation "', formation.name, '"');
                    d.resolve(createdFormation);                    
                }, function(err) {
                    notification.error('Failed to save formation "', formation.name, '"');
                    d.reject(err);
                });

        } else if(options.formation.action == Common.API.Actions.Overwrite) {
            // double check that the formation is  modified
            if(formation.modified) {

                self.updateFormation(formation)
                .then(function(updatedFormation: Common.Models.Formation) {
                    notification.success(
                        'Successfully saved formation "', formation.name, '"');
                    d.resolve(updatedFormation);
                }, function(err) {
                    notification.error('Failed to save formation "', formation.name, '"');
                    d.reject(err);
                });    

            } else {
                notification.warning('Formation "', formation.name, '" was not saved; no changes were detected.');
                d.reject(null);
            }
        }

        return d.promise;
    }

    /**
     * Retrieves all assignment groups for the current user
     */
    this.getAssignmentGroups = function() {
        var d = $q.defer();
        
        let assignmentsNotification = __notifications.pending(
            'Getting Assignments...'
        );

        __api.get(__api.path(
            PLAYBOOK.ENDPOINT,
            PLAYBOOK.GET_ASSIGNMENTGROUPS)
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let assignmentGroupCollection = new Common.Models.AssignmentGroupCollection(Team.Enums.UnitTypes.Mixed);
                
                for (let i = 0; i < results.length; i++) {
                    let result = results[i];
                    if(result && result.data && result.data.assignmentGroup) {
                        let assignmentGroupModel = new Common.Models.AssignmentGroup(Team.Enums.UnitTypes.Other);
                        assignmentGroupModel.key = result.key;
                        result.data.assignmentGroup.key = result.key;
                        assignmentGroupModel.fromJson(result.data.assignmentGroup);
                        assignmentGroupCollection.add(assignmentGroupModel, false);
                    }
                }

                assignmentsNotification.success(assignmentGroupCollection.size(), ' Assignment groups successfully retrieved');
                            
                d.resolve(assignmentGroupCollection);
            }, function(error: any) {
                assignmentsNotification.error('Failed to retrieve Assignment groups');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given assignment group for the current user
     * @param {Common.Models.AssignmentGroup} assignmentGroup The assignment group to be deleted
     */
    this.deleteAssignmentGroup = function(assignmentGroup: Common.Models.AssignmentGroup) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting assignment group "', assignmentGroup.name, '"...'
        );

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_ASSIGNMENTGROUP),
            {
                key: assignmentGroup.key
            }
        )
            .then(function(response: any) {
                let assignmentGroupKey = response.data.results.key;

                // update the context
                impakt.context.Playbook.assignmentGroups.remove(assignmentGroup.guid);

                notification.success(
                    'Successfully deleted assignment group "', assignmentGroup.name, '"'
                );

                $rootScope.$broadcast('delete-assignmentGroup', assignmentGroup);

                _associations.deleteAssociations(assignmentGroup.associationKey);

                d.resolve(assignmentGroupKey);
            }, function(error: any) {
                notification.error(
                    'Failed to delete assignment group "', assignmentGroup.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Creates a collection group
     * @param {[type]} assignments The assignments to create
     */
    this.createAssignmentGroup = function(assignmentGroup: Common.Models.AssignmentGroup) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Creating assignment group "', assignmentGroup.name, '"...'
        );

        __api.post(
            __api.path(
                PLAYBOOK.ENDPOINT, 
                PLAYBOOK.CREATE_ASSIGNMENTGROUP
            ),
            {
                version: 1,
                name: assignmentGroup.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: assignmentGroup.name,
                    ownerRK: 1,
                    parentRK: 1,
                    assignmentGroup: assignmentGroup.toJson()
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);

                let assignmentGroup = new Common.Models.AssignmentGroup(Team.Enums.UnitTypes.Other);
                if(results && results.data && results.data.assignmentGroup) {
                    let rawAssignmentGroup = results.data.assignmentGroup;

                    rawAssignmentGroup.key = results.key;
                    assignmentGroup.fromJson(rawAssignmentGroup);

                    impakt.context.Playbook.assignmentGroups.add(assignmentGroup, false);

                    notification.success(
                        'Successfully created assignment group "', assignmentGroup.name, '"'
                    );

                    $rootScope.$broadcast('create-entity', assignmentGroup);

                    d.resolve(assignmentGroup);
                } else {
                    notification.warning(
                        'Created assignment group "', assignmentGroup.name, '" but an error may have occurred \
                         in the process. You may need to refresh your browser if you experience issues.'
                    );
                    d.reject(null);
                }
            }, function(error: any) {
                notification.success(
                    'Failed to create assignment group "', assignmentGroup.name, '"'
                );
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Updates the given assignment collection (group) for the current user
     * @param {Common.Models.AssignmentGroup} assignments The assignment collection (group) to update
     */
    this.updateAssignmentGroup = function(assignmentGroup: Common.Models.AssignmentGroup) {
        var d = $q.defer();

        // update assignment group to json object
        let assignmentGroupData = assignmentGroup.toJson();

        let notification = __notifications.pending('Updating assignment group "', assignmentGroup.name, '"...');

        __api.post(__api.path(
            PLAYBOOK.ENDPOINT,
            PLAYBOOK.UPDATE_ASSIGNMENTGROUP),
            {
                version: 1,
                name: assignmentGroupData.name,
                key: assignmentGroupData.key,
                data: {
                    version: 1,
                    name: assignmentGroupData.name,
                    key: assignmentGroupData.key,
                    assignmentGroup: assignmentGroup.toJson()
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let assignmentGroupModel = new Common.Models.AssignmentGroup(Team.Enums.UnitTypes.Other);
                if (results && results.data && results.data.assignmentGroup) {
                    assignmentGroupModel.fromJson(results.data.assignmentGroup);

                    // update the context
                    impakt.context.Playbook.assignmentGroups.set(
                        assignmentGroupModel.guid, 
                        assignmentGroupModel
                    );
                }

                notification.success('Successfully updated assignment group "', assignmentGroupModel.name, '"');

                d.resolve(assignmentGroupModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update assignment group "', assignmentGroup.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }


    /**
     * Creates the given play for the current user
     * @param {Common.Models.Play} play The play to create
     */
    this.createPlay = function(play: Common.Models.Play) {

        let playData = play.toJson();

        var d = $q.defer();

        let notification = __notifications.pending(
            'Creating play "', play.name, '"...'
        );

        __api.post(
            __api.path(
                PLAYBOOK.ENDPOINT,
                PLAYBOOK.CREATE_PLAY
            ),
            {
                version: 1,
                name: play.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: play.name,
                    ownerRK: 1,
                    parentRK: 1,
                    play: playData
                }
            }
        )
        .then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);
            let playModel = null;
            if(results && results.data && results.data.play) {
                playModel = new Common.Models.PlayPrimary(Team.Enums.UnitTypes.Other);
                results.data.play.key = results.key;
                playModel.fromJson(results.data.play);
                impakt.context.Playbook.plays.add(playModel, false);
            }

            notification.success(
                'Successfully created play "', play.name, '"'
            );

            $rootScope.$broadcast('create-entity', playModel);

            d.resolve(playModel);
            
        }, function(error: any) {
            notification.error(
                'Failed to create play "', play.name, '"'
            );

            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Saves the given play according to the options passed for the given user
     * TODO @theBull create Options model
     *
     * @param {Common.Models.Play} play    [description]
     * @param {any}                  options [description]
     */
    this.savePlay = function(play: Common.Models.Play, options: Playbook.Models.PlaybookAPIOptions) {
        var d = $q.defer();

        let notification = __notifications.pending('Saving play "', play.name, '"...');

        async.parallel({
            /**
             * Save formation
             * @param {Function} callback [description]
             */
            formation: function(callback) {
                // create, copy, or overwrite?
                if(options.formation == Common.API.Actions.Create || 
                    options.formation == Common.API.Actions.Copy) {
                    
                        // ensure playbook.formation has no key
                        play.formation.key = -1;
                        self.createFormation(play.formation)
                        .then(function(createdFormation: Common.Models.Formation) {
                            play.formation = createdFormation;
                            callback(null, createdFormation);
                        }, function(err) {
                            callback(err);
                        });

                } else if(options.formation == Common.API.Actions.Overwrite) {
                    self.updateFormation(play.formation)
                    .then(function(updatedFormation: Common.Models.Formation) {
                        callback(null, updatedFormation);
                    }, function(err) {
                        callback(err);
                    });
                } else {
                    callback(null, play.formation);
                }
            },
            
            /**
             * Save personnel
             */
            // function(callback) {
            //     console.warn('Save Play > Personnel not implemented, skipping...');
            //     callback(null, play);
            // },
            
            /**
             * Save assignmentGroup
             * @param {Function} callback [description]
             */
            assignmentGroup: function(callback) {
                if (Common.Utilities.isNullOrUndefined(play.assignmentGroup))
                    callback(null, null);

                if (options.assignmentGroup == Common.API.Actions.Create ||
                    options.assignmentGroup == Common.API.Actions.Copy) {

                    // ensure play has no key
                    play.assignmentGroup.key = -1;
                    self.createAssignmentGroup(play.assignmentGroup)
                        .then(function(createdAssignmentGroup: Common.Models.AssignmentGroup) {
                            callback(null, createdAssignmentGroup);                        
                        }, function(err) {
                            callback(err);
                        });

                } else if (options.assignmentGroup == Common.API.Actions.Overwrite) {
                    
                    self.updateAssignmentGroup(play.assignmentGroup)
                        .then(function(updatedAssignmentGroup: Common.Models.AssignmentGroup) {
                            callback(null, updatedAssignmentGroup);
                        }, function(err) {
                            callback(err);
                        });

                } else {
                    callback(null, play.assignmentGroup);
                }
            },
            
            /**
             * Save play
             * @param {Function} callback [description]
             */
            play: function(callback) {
           
                if(options.play == Common.API.Actions.Create || 
                    options.play == Common.API.Actions.Copy) {
                    
                        // ensure play has no key
                        play.key = -1;
                        self.createPlay(play)
                        .then(function(createdPlay: Common.Models.Play) {
                            callback(null, createdPlay);
                        }, function(err) {
                            callback(err);
                        });

                } else if(options.play == Common.API.Actions.Overwrite) {

                    self.updatePlay(play)
                    .then(function(updatedPlay: Common.Models.Play) {
                        callback(null, updatedPlay);
                    }, function(err) {
                        callback(err);
                    });
                    
                } else {
                    callback(null, play);
                }
            }
        }, function(err, results) {
            if(err) {
                notification.error('Failed to save play "', play.name, '"');
                d.reject(err);
            } else {
                notification.success('Successfully saved play "', play.name, '"');

                if(Common.Utilities.isNullOrUndefined(options)) {
                    d.resolve(results);
                } else {
                    if(Common.Utilities.isNotNullOrUndefined(results) &&
                        Common.Utilities.isNotNullOrUndefined(results.play)) {
                        
                        // Update the play associations before resolving all associations;
                        // this Step is necessary, since we are either creating, updating
                        // or doing nothing to the entity; this will ensure that the results
                        // of each async call returns the most up-to-date entity.
                        // 
                        // NOTE:
                        // the -1 check: at this point, we are expecting fully-created
                        // entities (they are stored in the database); if the entity
                        // has a key < 0, they have not been added to the database,
                        // so prevent them from being added as an association.
                        if(Common.Utilities.isNotNullOrUndefined(results.formation) &&
                            options.associated && options.associated.formations &&
                            results.formation.key > -1) {
                            options.associated.formations[0] = results.formation;
                        } else {
                            options.associated.formations = [];
                        }
                        if(Common.Utilities.isNotNullOrUndefined(results.assignmentGroup) &&
                            options.associated && options.associated.assignmentGroups &&
                            results.assignmentGroup.key > -1) {
                            options.associated.assignmentGroups[0] = results.assignmentGroup;
                        } else {
                            options.associated.assignmentGroups = [];
                        }
                        
                        _updatePlayAssociations(results.play, options).then(function(results) {
                            d.resolve(results);
                        }, function(err) {
                            d.reject(err);
                        });
                    } else {
                        d.resolve(results);
                    }
                }
            }
        });

        return d.promise;
    }

    // Pre-condition: options.associated is not null or undefined
    function _updatePlayAssociations(play: Common.Interfaces.IPlay, options: Playbook.Models.PlaybookAPIOptions) {
        let d = $q.defer();

        let associatedEmpty = false;
        let associatedEntityArray = options.associatedToArray();
                    
        if(Common.Utilities.isNullOrUndefined(options) ||
            !options.associated || options.associated.length <= 0) {
            associatedEmpty = true;
        }

        let notification = __notifications.pending('Saving associations for play "', play.name, '"...');
        async.parallel({
            play: function(callback) {
                if(associatedEmpty) {
                    callback(null, null);
                } else {
                    // Create associations:
                    // Play -> [Playbook, AssignmentGroup, Formation]
                    _associations.createAssociations(play, associatedEntityArray).then(function() {
                        callback(null, associatedEntityArray);
                    }, function(err) {
                        callback(err, null);
                    });
                }
            },
            playbook: function(callback) {
                let associatedPlaybook = options.associated.playbooks[0];
                if(associatedEmpty || Common.Utilities.isNullOrUndefined(associatedPlaybook)) {
                    callback(null, null);
                } else {
                    // Create Associations:
                    // Playbook -> [AssignmentGroup, Formation]
                    let playbookAssociations = [];
                    if(Common.Utilities.isNotNullOrUndefined(options.associated.formations) &&
                        Common.Utilities.isNotNullOrUndefined(options.associated.formations[0])) {
                        playbookAssociations.push(options.associated.formations[0]);
                    }
                    if(Common.Utilities.isNotNullOrUndefined(options.associated.assignmentGroups) &&
                        Common.Utilities.isNotNullOrUndefined(options.associated.assignmentGroups[0])) {
                        playbookAssociations.push(options.associated.assignmentGroups[0]);
                    }
                    if(playbookAssociations.length > 0) {
                        _associations.createAssociations(associatedPlaybook, playbookAssociations).then(function() {
                            callback(null, playbookAssociations);
                        }, function(err) {
                            callback(err, null);
                        });
                    } else {
                        callback(null, null);
                    }
                }                    
            }
        }, function(err, results) {
            if(err) {
                notification.error('Failed to save play "', play.name, '"; update associations failed.');
                d.reject(err);
            } else {
                notification.success('Successfully saved associations for play "', play.name, '"');
                d.resolve(results);
            }
        });
       

        return d.promise;
    }


    /**
     * Updates the given play for the current user
     * @param {Common.Models.Play} play The play to update
     */
    this.updatePlay = function(play: Common.Interfaces.IPlay) {
        var d = $q.defer();

        let notification = __notifications.pending('Updating play "', play.name, '"...');

        let playData = play.toJson();

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_PLAY),
            {
                version: 1,
                name: play.name,
                key: play.key,
                data: {
                    version: 1,
                    name: play.name,
                    key: play.key,
                    play: playData
                }
            }
        )
        .then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);
            let playModel = new Common.Models.PlayPrimary(Team.Enums.UnitTypes.Other);
            if(results && results.data && results.data.play) {
                playModel.fromJson(results.data.play);

                // update the context
                impakt.context.Playbook.plays.set(playModel.guid, playModel);
            }

            notification.success('Successfully updated play "', playModel.name, '"');

            d.resolve(playModel);
        }, function(error: any) {
            notification.error(
                'Failed to update play "', play.name, '"'
            );

            d.reject(error);
        });

        return d.promise;
    }


    /**
     * Retrieves all plays for the current user
     */
    this.getPlays = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting Plays...'
        );

        __api.get(
            __api.path(
                PLAYBOOK.ENDPOINT,
                PLAYBOOK.GET_PLAYS
            )
        )
        .then(function(response: any) {
            
            let playCollection = new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed);
            
            if(response && response.data && response.data.results) {
                let results = Common.Utilities.parseData(response.data.results);
                if (results) {
                    let rawPlays = results;
                    for (let i = 0; i < results.length; i++) {
                        let result = results[i];
                        if (result && result.data && result.data.play) {
                            let rawPlay = result.data.play;
                            let playModel = new Common.Models.PlayPrimary(Team.Enums.UnitTypes.Other);
                            rawPlay.key = result.key;
                            playModel.fromJson(rawPlay);
                            playCollection.add(playModel, false);
                        }
                    }    
                }                
            }
            
            notification.success(playCollection.size(), ' Plays successfully retrieved');
            d.resolve(playCollection);
            
        }, function(error: any) {
            notification.error('Failed to retrieve Plays');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Prepares the given play to be opened in the play editor
     * @param {Common.Models.Play} play The play to be edited
     */
    this.editPlay = function(play: Common.Interfaces.IPlay) {
        let notification = __notifications.info('Opened play "', play.name, '" for editing.');
        
        // Set Play to play editing mode
        let scenario = new Common.Models.Scenario();
        let playCopy = <Common.Models.PlayPrimary>play.copy();
        if(play.playType != Playbook.Enums.PlayTypes.Primary) {
            playCopy = Common.Models.Play.toPrimary(playCopy);
        }
        scenario.setPlayPrimary(playCopy);
        scenario.setPlayOpponent(null);
        scenario.name = playCopy.name;
        scenario.editorType = Playbook.Enums.EditorTypes.Play;

        // Set association data
        this.setPlayAssociations(scenario.playPrimary);
        
        // add the play onto the editor context
        impakt.context.Playbook.editor.scenarios.add(scenario, false);

        // navigate to playbook editor
        //if (!$state.is('playbook.editor'))
        $state.transitionTo('playbook.editor');
    }

    /**
     * Deletes the given play for the current user
     * @param {Common.Models.Play} play The play to be deleted
     */
    this.deletePlay = function(play: Common.Models.Play) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting play "', play.name, '"...'
        );

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_PLAY),
            {
                key: play.key
            }
        )
            .then(function(response: any) {
                let playKey = response.data.results.key;
                
                // update the context
                impakt.context.Playbook.plays.remove(play.guid);

                notification.success(
                    'Successfully deleted play "', play.name, '"'
                );

                $rootScope.$broadcast('delete-play', play);

                _associations.deleteAssociations(play.associationKey);

                d.resolve(play);
            }, function(error: any) {
                notification.error('Failed to delete play "', play.name, '"');

                d.reject(error);
            });

        return d.promise;
    }


    /**
     * Creates the given scenario for the current user
     * @param {Common.Models.Scenario} scenario The scenario to create
     */
    this.createScenario = function(scenario: Common.Models.Scenario) {

        let scenarioData = scenario.toJson();

        var d = $q.defer();

        let notification = __notifications.pending(
            'Creating scenario "', scenario.name, '"...'
        );

        __api.post(
            __api.path(
                PLAYBOOK.ENDPOINT,
                PLAYBOOK.CREATE_SCENARIO
            ),
            {
                version: 1,
                name: scenario.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: scenario.name,
                    ownerRK: 1,
                    parentRK: 1,
                    scenario: scenarioData
                }
            }
        )
        .then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);
            let scenarioModel = null;
            if(results && results.data && results.data.scenario) {
                scenarioModel = new Common.Models.Scenario();
                results.data.scenario.key = results.key;
                scenarioModel.fromJson(results.data.scenario);
                impakt.context.Playbook.scenarios.add(scenarioModel, false);
            }

            notification.success(
                'Successfully created scenario "', scenario.name, '"'
            );

            $rootScope.$broadcast('create-entity',scenarioModel);

            d.resolve(scenarioModel);
            
        }, function(error: any) {
            notification.error(
                'Failed to create scenario "', scenario.name, '"'
            );

            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Saves the given scenario according to the options passed for the given user
     * TODO @theBull create Options model
     *
     * @param {Common.Models.Scenario} scenario    [description]
     * @param {any}                  options [description]
     */
    this.saveScenario = function(
        scenario: Common.Models.Scenario, 
        playPrimaryOptions: Playbook.Models.PlaybookAPIOptions,
        playOpponentOptions: Playbook.Models.PlaybookAPIOptions
    ) {
    
        var d = $q.defer();

        let notification = __notifications.pending('Saving scenario "', scenario.name, '"...');

        async.parallel([
            function(callback) {
                if(Common.Utilities.isNotNullOrUndefined(scenario.playPrimary)) {
                    self.savePlay(scenario.playPrimary, playPrimaryOptions).then(function(results) {
                        callback(null, results);
                    }, function(err) {
                        callback(err);
                    });
                } else {
                    callback(null, null);
                }
            },
            function(callback) {
                if (Common.Utilities.isNotNullOrUndefined(scenario.playOpponent)) {
                    self.savePlay(scenario.playOpponent, playOpponentOptions).then(function(results) {
                        callback(null, results);
                    }, function(err) {
                        callback(err);
                    });
                } else {
                    callback(null, null);
                }
            }
        ], function(err, results) {
            if(err) {
                notification.error('Failed to save scenario "', scenario.name, '"');
                d.reject(err);
            } else {
                notification.success('Successfully saved scenario "', scenario.name, '"');
                d.resolve(results);
            }
        });

        return d.promise;
    }


    /**
     * Updates the given scenario for the current user
     * @param {Common.Models.Scenario} scenario The scenario to update
     */
    this.updateScenario = function(scenario: Common.Models.Scenario) {
        var d = $q.defer();

        let notification = __notifications.pending('Updating scenario "', scenario.name, '"...');

        let scenarioData = scenario.toJson();

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_SCENARIO),
            {
                version: 1,
                name: scenario.name,
                key: scenario.key,
                data: {
                    version: 1,
                    name: scenario.name,
                    key: scenario.key,
                    scenario: scenarioData
                }
            }
        )
        .then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);
            let scenarioModel = new Common.Models.PlayPrimary(Team.Enums.UnitTypes.Other);
            if(results && results.data && results.data.scenario) {
                scenarioModel.fromJson(results.data.scenario);

                // update the context
                impakt.context.Playbook.scenarios.set(scenarioModel.guid, scenarioModel);
            }

            notification.success('Successfully updated scenario "', scenarioModel.name, '"');

            d.resolve(scenarioModel);
        }, function(error: any) {
            notification.error(
                'Failed to update scenario "', scenario.name, '"'
            );

            d.reject(error);
        });

        return d.promise;
    }


    /**
     * Retrieves all scenarios for the current user
     */
    this.getScenarios = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting Scenarios...'
        );

        __api.get(
            __api.path(
                PLAYBOOK.ENDPOINT,
                PLAYBOOK.GET_SCENARIOS
            )
        )
        .then(function(response: any) {
            
            let scenarioCollection = new Common.Models.ScenarioCollection(Team.Enums.UnitTypes.Mixed);
            
            if(response && response.data && response.data.results) {
                let results = Common.Utilities.parseData(response.data.results);
                if (results) {
                    let rawScenarios = results;
                    for (let i = 0; i < results.length; i++) {
                        let result = results[i];
                        if (result && result.data && result.data.scenario) {
                            let rawScenario = result.data.scenario;
                            let scenarioModel = new Common.Models.Scenario();
                            rawScenario.key = result.key;
                            scenarioModel.fromJson(rawScenario);
                            scenarioCollection.add(scenarioModel, false);
                        }
                    }    
                }                
            }
            
            notification.success(scenarioCollection.size(), ' Scenarios successfully retrieved');
            d.resolve(scenarioCollection);
            
        }, function(error: any) {
            notification.error('Failed to retrieve Scenarios');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Prepares the given scenario to be opened in the editor
     * @param {Common.Models.Scenario} scenario The scenario to be edited
     */
    this.editScenario = function(scenario: Common.Models.Scenario) {
        let notification = __notifications.info('Opened scenario "', scenario.name, '" for editing.');

        // add the scenario onto the editor context
        let scenarioCopy = scenario.copy();
        scenarioCopy.editorType = Playbook.Enums.EditorTypes.Scenario;
        this.setScenarioAssociations(scenarioCopy);
        impakt.context.Playbook.editor.scenarios.add(scenarioCopy, false); // <-- create copy

        // navigate to playbook editor
        //if (!$state.is('playbook.editor'))
        $state.transitionTo('playbook.editor');
    }

    /**
     * Deletes the given scenario for the current user
     * @param {Common.Models.Scenario} scenario The scenario to be deleted
     */
    this.deleteScenario = function(scenario: Common.Models.Scenario) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting scenario "', scenario.name, '"...'
        );

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_SCENARIO),
            {
                key: scenario.key
            }
        )
            .then(function(response: any) {
                let scenarioKey = response.data.results.key;
                
                // update the context
                impakt.context.Playbook.scenarios.remove(scenario.guid);

                notification.success(
                    'Successfully deleted scenario "', scenario.name, '"'
                );

                $rootScope.$broadcast('delete-scenario', scenario);

                _associations.deleteAssociations(scenario.associationKey);

                d.resolve(scenario);
            }, function(error: any) {
                notification.error('Failed to delete scenario "', scenario.name, '"');

                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Returns a list of all unit types
     */
    this.getUnitTypes = function() {
        return new Team.Models.UnitTypeCollection();
    }

    /**
     * Returns an list of all unit types
     */
    this.getUnitTypesEnum = function() {
        let typeEnums = {};
        for (let unitType in Team.Enums.UnitTypes) {
            let unitTypeInt = parseInt(unitType);
            if (unitTypeInt >= 0)
                typeEnums[unitTypeInt]
                    = Common.Utilities.camelCaseToSpace(
                        Team.Enums.UnitTypes[unitTypeInt], true);
        }
        return typeEnums;
    }

    /**
     * Returns a class for the given editorType
     * @param {Playbook.Enums.EditorTypes} editorType Editor Type enum
     */
    this.getEditorTypeClass = function(editorType: Playbook.Enums.EditorTypes) {
        let editorTypeClass = '';
        switch (editorType) {
            case Playbook.Enums.EditorTypes.Formation:
                editorTypeClass = 'playbook-editor-type-formation';
                break;
            case Playbook.Enums.EditorTypes.Assignment:
                editorTypeClass = 'playbook-editor-type-assignment';
                break;
            case Playbook.Enums.EditorTypes.Play:
                editorTypeClass = 'playbook-editor-type-play';
                break;
            case Playbook.Enums.EditorTypes.Scenario:
                editorTypeClass = 'playbook-editor-type-scenario';
                break;
        }

        return editorTypeClass;
    }

    /**
     * Navigates to the playbook editor
     */
    this.toEditor = function() {
        $state.transitionTo('playbook.editor');
    }

    /**
     * Refreshes the playbook editor
     */
    this.refreshEditor = function() {
        $rootScope.$broadcast('playbook-editor.refresh');
    }

    /**
     * Navigates to the playbook browser
     */
    this.toBrowser = function() {
        this.drilldown.playbook = null;
        impakt.context.Playbook.playbooks.deselectAll();
        impakt.context.Actionable.selected.deselectAll();
        $state.transitionTo('playbook.browser');
    }

    this.toPlaybookDrilldown = function(playbookModel: Common.Models.PlaybookModel) {
        this.drilldown.playbook = playbookModel;
        impakt.context.Playbook.playbooks.select(playbookModel);
        impakt.context.Actionable.selected.only(playbookModel);
        $state.transitionTo('playbook.drilldown.playbook');
    }

    /**
     * Navigates to the team module
     */
    this.toTeam = function() {
        $state.transitionTo('team');
    }

    /**
     * Takes a given entity (of unknown type) and uses its internally
     * defined ImpaktDataType to determine the appropriate API method
     * to call.
     * 
     * @param {Common.Interfaces.IActionable} entity The entity to delete
     */
    this.deleteEntityByType = function(entity: Common.Interfaces.IActionable) {
        let d = $q.defer();

        switch(entity.impaktDataType) {
            case Common.Enums.ImpaktDataTypes.Playbook:
                return _playbookModals.deletePlaybook(entity);
            case Common.Enums.ImpaktDataTypes.Play:
                return _playbookModals.deletePlay(entity);
            case Common.Enums.ImpaktDataTypes.Formation:
                return _playbookModals.deleteFormation(entity);
            case Common.Enums.ImpaktDataTypes.AssignmentGroup:
                return _playbookModals.deleteAssignmentGroup(entity);
            case Common.Enums.ImpaktDataTypes.Scenario:
                return _playbookModals.deleteScenario(entity);
            default:
                d.reject(new Error('_playbook deleteEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise;
    }

    /**
     * Takes a given entity (of unknown type) and uses its internally
     * defined ImpaktDataType to determine the appropriate API method
     * to call.
     * 
     * @param {Common.Interfaces.IActionable} entity The entity to delete
     */
    this.updateEntityByType = function(entity: Common.Interfaces.IActionable) {
        let d = $q.defer();

        switch(entity.impaktDataType) {
            case Common.Enums.ImpaktDataTypes.Playbook:
                return _playbookModals.updatePlaybook(entity);
            case Common.Enums.ImpaktDataTypes.Play:
                return _playbookModals.updatePlay(entity);
            case Common.Enums.ImpaktDataTypes.Formation:
                return _playbookModals.updateFormation(entity);
            case Common.Enums.ImpaktDataTypes.AssignmentGroup:
                return _playbookModals.updateAssignmentGroup(entity);
            case Common.Enums.ImpaktDataTypes.Scenario:
                return _playbookModals.updateScenario(entity);
            default:
                d.reject(new Error('_playbook deleteEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise;
    }

    this.setScenarioAssociations = function(scenario: Common.Models.Scenario): Common.Models.Scenario {
        let associations = _associations.getAssociated(scenario);
        let plays = associations.plays;
        if(Common.Utilities.isNotNullOrUndefined(plays)) {
            let playPrimary = plays.filterFirst(function(play: Common.Interfaces.IPlay, index: number) {
                return play.guid == scenario.playPrimaryGuid;
            });
            let playOpponent = plays.filterFirst(function(play: Common.Interfaces.IPlay, index: number) {
                return play.guid == scenario.playOpponentGuid;
            });
            if(Common.Utilities.isNotNullOrUndefined(playPrimary)) {
                this.setPlayAssociations(playPrimary);
                scenario.setPlayPrimary(playPrimary);
            }
            if(Common.Utilities.isNotNullOrUndefined(playOpponent)) {
                this.setPlayAssociations(playOpponent);
                scenario.setPlayOpponent(playOpponent);
            }
        }

        return scenario;
    }

    this.setPlayAssociations = function(play: Common.Interfaces.IPlay): Common.Interfaces.IPlay {
		let associations = _associations.getAssociated(play);
		let formation = associations.formations.first();
        play.formation = formation && formation.copy();
		let assignmentGroup = associations.assignmentGroups.first();
        play.assignmentGroup = assignmentGroup && assignmentGroup.copy();
		let personnel = associations.personnel.first();
        play.personnel = personnel && personnel.copy();

		return play;
    }

    this.setFormationAssociations = function(play: Common.Interfaces.IPlay): Common.Interfaces.IPlay {
		if (Common.Utilities.isNullOrUndefined(play))
			return;

    	let associations = _associations.getAssociated(play.formation);
		let personnel = associations.personnel.first();
        play.personnel = personnel && personnel.copy();
    }

    this.getAssignmentGroupAPIActions = function(assignmentGroup: Common.Models.AssignmentGroup): Common.API.Actions {
        if (Common.Utilities.isNullOrUndefined(assignmentGroup) ||
            Common.Utilities.isNullOrUndefined(assignmentGroup.assignments))
            return Common.API.Actions.Nothing;

        return assignmentGroup.assignments.hasElements() ?
            (assignmentGroup.key == -1 ?
                Common.API.Actions.Create : Common.API.Actions.Overwrite) : // always create or overwrite
            Common.API.Actions.Nothing // don't do anything if there are no assignments
    }

}]);