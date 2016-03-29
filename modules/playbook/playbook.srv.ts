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
function(
    PLAYBOOK: any,
    $rootScope: any,
    $q: any,
    $state: any,
    __api: any,
    __localStorage: any,
    __notifications: any) {

    var self = this;

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

                let collection = new Playbook.Models.PlaybookModelCollection();

                if (response && response.data && response.data.results) {

                    let playbookResults = Common.Utilities.parseData(response.data.results);
                    

                    for (let i = 0; i < playbookResults.length; i++) {
                        let playbookResult = playbookResults[i];

                        if (playbookResult && playbookResult.data && playbookResult.data.model) {
                            let playbookModel = new Playbook.Models.PlaybookModel();
                            playbookResult.data.model.key = playbookResult.key;
                            playbookModel.fromJson(playbookResult.data.model);

                            collection.add(playbookModel);
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
     * @param {Playbook.Models.PlaybookModel} playbookModel The model to be created/saved
     */
    this.createPlaybook = function(playbookModel: Playbook.Models.PlaybookModel) {
        var d = $q.defer();

        // set key to -1 to ensure a new object is created server-side
        playbookModel.key = -1;
        let playbookModelJson = playbookModel.toJson();
        let notification = __notifications.pending(
            'Creating playbook "', playbookModel.name, '"...'
        );
        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_PLAYBOOK),
            {
                version: 1,
                name: playbookModel.name,
                data: {
                    version: 1,
                    model: playbookModelJson
                }
            }
        )
        .then(function(response: any) {
            let results = Common.Utilities.parseData(response.data.results);
            let playbook = new Playbook.Models.PlaybookModel();
            
            if(results && results.data && results.data.model) {
                playbook.fromJson(results.data.model);  

                // update the context
                impakt.context.Playbook.playbooks.add(playbook);

            } else {
                throw new Error('CreatePlaybook did not return a valid playbook model');
            }

            notification.success(
                'Successfully created playbook "', playbook.name, '"'
            );
            
            d.resolve(playbook);
        }, function(error: any) {
            notification.error('Failed to create playbook "', playbookModel.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Deletes the given playbook for the current user
     * @param {Playbook.Models.PlaybookModel} playbook The playbook to be deleted
     */
    this.deletePlaybook = function(playbook: Playbook.Models.PlaybookModel) {
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

            d.resolve(playbook);
        }, function(error: any) {
            notification.error('Failed to delete playbook "', playbook.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Creates the given formation for the current user
     * @param {Playbook.Models.Formation} newFormation The formation to be created
     */
    this.createFormation = function(newFormation: Playbook.Models.Formation) {
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
            }
        )
            .then(function(response: any) {
                let result = Common.Utilities.parseData(response.data.results);
                
                if (!result || !result.data || !result.data.formation) {
                    d.reject('Create playbook result was invalid');
                }
                let formationModel = new Playbook.Models.Formation();
                formationModel.fromJson(result.data.formation);
                console.log(formationModel);

                impakt.context.Playbook.formations.add(formationModel);

                notification.success(
                    'Successfully created formation "', formationModel.name, '"'
                );

                self.editFormation(formationModel);

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
     * @param {Playbook.Models.Formation} formation The formation to be deleted
     */
    this.deleteFormation = function(formation: Playbook.Models.Formation) {
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
                let collection = new Playbook.Models.FormationCollection();
                let formations = [];
                for (let i = 0; i < results.length; i++) {
                    let result = results[i];
                    if (result && result.data && result.data.formation) {
                        let formation = result.data.formation;
                        formation.key = result.key;
                        formations.push(formation);
                    } else {
                        throw new Error('An invalid formation was retrieved');
                    }
                }

                collection.fromJson(formations);

                notification.success(collection.size(), ' Formations successfully retrieved');

                d.resolve(collection);

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

                let formationModel = new Playbook.Models.Formation()
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
     * @param {Playbook.Models.Formation} formation The formation to be edited
     */
    this.editFormation = function(formation: Playbook.Models.Formation, forceOpen?: boolean) {
        // determine whether the formation is already open            
        let formationOpen = forceOpen ? forceOpen : impakt.context.Playbook.editor.plays.hasElementWhich(
            function(play) {
                return play.editorType == Playbook.Editor.EditorTypes.Formation &&
                    play.formation.guid == formation.guid;
            });

        // do not add a new editor play to the context if the formation
        // is already open
        if(!formationOpen) {
            // formation isn't opened yet,
            // 1. create new play for the formation to sit in
            // 2. create a working copy of the formation
            // 3. update the working copy's properties accordingly
            // 4. add the working play to the editor context
        
            // Set Play to formation-only editing mode
            let play = new Playbook.Models.PlayPrimary();

            // need to make a copy of the formation here
            let formationCopy = formation.copy();
            play.setFormation(formationCopy);
            play.editorType = Playbook.Editor.EditorTypes.Formation;
            play.unitType = formation.unitType;
            play.name = formation.name;

            // add the play onto the editor context
            impakt.context.Playbook.editor.plays.add(play);
        }

        // navigate to playbook editor
        //if(!$state.is('playbook.editor'))
        $state.transitionTo('playbook.editor');        
    }

    /**
     * Updates the given formation for the current user
     * @param {Playbook.Models.Formation} formation The formation to update
     */
    this.updateFormation = function(formation: Playbook.Models.Formation) {
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
            let formationModel = new Playbook.Models.Formation();
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
     * @param {Playbook.Models.Formation} formation    Formation to save
     * @param {any}                  options Save options
     */
    this.saveFormation = function(formation: Playbook.Models.Formation, options: any) {
        var d = $q.defer();

        let notification = __notifications.pending('Saving formation "', formation.name, '"...');

        if(options.formation.action == Common.API.Actions.Create || 
            options.formation.action == Common.API.Actions.Copy) {
            
                // ensure formation has no key
                formation.key = -1;
                // ensure formation has a unique guid
                formation.guid = Common.Utilities.guid();
                
                self.createFormation(formation)
                .then(function(createdFormation: Playbook.Models.Formation) {
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
                .then(function(updatedFormation: Playbook.Models.Formation) {
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
     * Retrieves all sets (for the given playbook?) of the current user
     * @param {[type]} playbook ???
     */
    this.getSets = function(playbook) {
        var d = $q.defer();
        
        let personnelNotification = __notifications.pending(
            'Getting Personnel...'
        );
        let assignmentsNotification = __notifications.pending(
            'Getting Assignments...'
        );

        __api.get(__api.path(
            PLAYBOOK.ENDPOINT,
            PLAYBOOK.GET_SETS)
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);

                let personnelResults = [];
                let personnelCollection = new Playbook.Models.PersonnelCollection();
                let assignmentResults = [];
                let assignmentCollection = new Playbook.Models.AssignmentCollection();
                
                // get personnel & assignments from `sets`
                for (var i = 0; i < results.length; i++) {
                    let result = results[i];
                    if (result && result.data) {
                        let data = result.data;
                        switch (data.setType) {
                            case Playbook.Editor.SetTypes.Personnel:
                                data.personnel.key = result.key;
                                personnelResults.push(data.personnel);
                                break;
                            case Playbook.Editor.SetTypes.Assignment:
                                data.assignment.key = result.key;
                                assignmentResults.push(data.assignment);
                                break;
                        }
                    }
                }

                for (let i = 0; i < personnelResults.length; i++) {
                    let personnel = personnelResults[i];
                    let personnelModel = new Playbook.Models.Personnel();
                    personnelModel.fromJson(personnel);
                    personnelCollection.add(personnelModel);
                }
                for (let i = 0; i < assignmentResults.length; i++) {
                    let assignment = assignmentResults[i];
                    let assignmentModel = new Playbook.Models.Assignment();
                    assignmentModel.fromJson(assignment);
                    assignmentCollection.add(assignmentModel);
                }

                personnelNotification.success(personnelCollection.size(), ' Personnel groups successfully retrieved');
                assignmentsNotification.success(assignmentCollection.size(), ' Assignment sets successfully retrieved');
                            
                d.resolve({
                    personnel: personnelCollection,
                    assignments: assignmentCollection
                });
            }, function(error: any) {
                personnelNotification.error('Failed to retrieve Personnel groups');
                assignmentsNotification.error('Failed to retrieve Assignment groups');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Creates a set (TO-DO)
     * @param {[type]} set The set to create
     */
    this.createSet = function(set) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Creating set "', set.name, '"...'
        );

        __api.post(
            __api.path(
                PLAYBOOK.ENDPOINT, 
                PLAYBOOK.CREATE_SET
            ),
            {
                version: 1,
                name: set.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: set.name,
                    ownerRK: 1,
                    parentRK: 1,
                    set: set
                }
            }
        )
            .then(function(response: any) {
                let set = Common.Utilities.parseData(response.data.results);


                // let setModel = new Playbook.Models.Set(
                //     set.name, set.type, set.positions
                // );
                // setModel.fromJson(set);

                throw new Error('createSet not implemented');

                notification.success(
                    'Successfully created set "', set.name, '"'
                );

                d.resolve(null);
            }, function(error: any) {
                notification.success(
                    'Failed to create set "', set.name, '"'
                );
                d.reject(error);
            });

        return d.promise;
    }


    /**
     * Creates the given play for the current user
     * @param {Playbook.Models.Play} play The play to create
     */
    this.createPlay = function(play: Playbook.Models.Play) {

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
                playModel = new Playbook.Models.Play();
                playModel.fromJson(results.data.play);
                playModel.key = results.key;
                impakt.context.Playbook.plays.add(playModel);
            }

            notification.success(
                'Successfully created play "', play.name, '"'
            );

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
     * @param {Playbook.Models.Play} play    [description]
     * @param {any}                  options [description]
     */
    this.savePlay = function(play: Playbook.Models.Play, options: any) {
        var d = $q.defer();

        let notification = __notifications.pending('Saving play "', play.name, '"...');

        async.parallel([
            // 
            // Save formation
            // 
            function(callback) {
                // create, copy, or overwrite?
                if(options.formation.action == Common.API.Actions.Create || 
                    options.formation.action == Common.API.Actions.Copy) {
                    
                        // ensure playbook.formation has no key
                        play.formation.key = -1;
                        self.createFormation(play.formation)
                        .then(function(createdFormation: Playbook.Models.Formation) {
                            play.formation = createdFormation;
                            callback(null, play);
                        }, function(err) {
                            callback(err);
                        });

                } else if(options.formation.action == Common.API.Actions.Overwrite) {
                    if(play.formation.modified) {

                        self.updateFormation(play.formation)
                        .then(function(updatedFormation: Playbook.Models.Formation) {
                            callback(null, play);
                        }, function(err) {
                            callback(err);
                        });    

                    } else {
                        callback(null, play);
                    }
                } else {
                    callback(null, play);
                }
            },
            // save personnel
            // function(callback) {
            //     console.warn('Save Play > Personnel not implemented, skipping...');
            //     callback(null, play);
            // },
            // // save assignments
            // function(callback) {
            //     console.warn('Save Play > Assignments not implemented, skipping...');
            //     callback(null, play);
            // },
            // save play
            function(callback) {
           
                if(options.play.action == Common.API.Actions.Create || 
                    options.play.action == Common.API.Actions.Copy) {
                    
                        // ensure play has no key
                        play.key = -1;
                        self.createPlay(play)
                        .then(function(createdPlay: Playbook.Models.Play) {
                            callback(null, createdPlay);
                        }, function(err) {
                            callback(err);
                        });

                } else if(options.play.action == Common.API.Actions.Overwrite) {
                    if(play.modified) {

                        self.updatePlay(play)
                        .then(function(updatedPlay: Playbook.Models.Play) {
                            callback(null, updatedPlay);
                        }, function(err) {
                            callback(err);
                        });

                    } else {
                        callback(null, play);
                    }
                } else {
                    callback(null, play);
                }
            }
        ], function(err, results) {
            if(err) {
                notification.error('Failed to save play "', play.name, '"');
                d.reject(err);
            } else {
                notification.success('Successfully saved play "', play.name, '"');
                d.resolve(results);
            }
        });

        return d.promise;
    }


    /**
     * Updates the given play for the current user
     * @param {Playbook.Models.Play} play The play to update
     */
    this.updatePlay = function(play: Playbook.Models.Play) {
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
            let playModel = new Playbook.Models.Play();
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
            
            let playCollection = new Playbook.Models.PlayCollection();
            
            if(response && response.data && response.data.results) {
                let results = Common.Utilities.parseData(response.data.results);
                if (results) {
                    let rawPlays = results;
                    for (let i = 0; i < results.length; i++) {
                        let result = results[i];
                        if (result && result.data && result.data.play) {
                            let playModel = new Playbook.Models.Play();
                            playModel.fromJson(result.data.play);
                            playModel.key = result.key;
                            playCollection.add(playModel);
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
     * @param {Playbook.Models.Play} play The play to be edited
     */
    this.editPlay = function(play: Playbook.Models.Play) {
        
        // Set Play to play editing mode
        play.editorType = Playbook.Editor.EditorTypes.Play;

        if(!play.formation) {
            let associatedFormation = play.associated.formations.primary();
            if(associatedFormation) {
                play.formation = impakt.context.Playbook.formations.get(associatedFormation);
            }
        }
        if (!play.personnel) {
            let associatedPersonnel = play.associated.personnel.primary();
            if (associatedPersonnel) {
                play.personnel = impakt.context.Playbook.personnel.get(associatedPersonnel);
            }
        }

        
        // add the play onto the editor context
        impakt.context.Playbook.editor.plays.add(play);

        // navigate to playbook editor
        //if (!$state.is('playbook.editor'))
            $state.transitionTo('playbook.editor');
    }

    /**
     * Deletes the given play for the current user
     * @param {Playbook.Models.Play} play The play to be deleted
     */
    this.deletePlay = function(play: Playbook.Models.Play) {
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

                d.resolve(play);
            }, function(error: any) {
                notification.error('Failed to delete play "', play.name, '"');

                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Returns a list of all unit types
     */
    this.getUnitTypes = function() {
        return new Playbook.Models.UnitTypeCollection();
    }

    /**
     * Returns an list of all unit types
     */
    this.getUnitTypesEnum = function() {
        let typeEnums = {};
        for (let unitType in Playbook.Editor.UnitTypes) {
            if (unitType >= 0)
                typeEnums[parseInt(unitType)]
                    = Common.Utilities.camelCaseToSpace(
                        Playbook.Editor.UnitTypes[unitType], true);
        }
        return typeEnums;
    }

    /**
     * Returns a class for the given editorType
     * @param {Playbook.Editor.EditorTypes} editorType Editor Type enum
     */
    this.getEditorTypeClass = function(editorType: Playbook.Editor.EditorTypes) {
        let editorTypeClass = '';
        switch (editorType) {
            case Playbook.Editor.EditorTypes.Formation:
                editorTypeClass = 'playbook-editor-type-formation';
                break;
            case Playbook.Editor.EditorTypes.Assignment:
                editorTypeClass = 'playbook-editor-type-assignment';
                break;
            case Playbook.Editor.EditorTypes.Play:
                editorTypeClass = 'playbook-editor-type-play';
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
        $state.transitionTo('playbook.browser');
    }

    /**
     * Navigates to the team module
     */
    this.toTeam = function() {
        $state.transitionTo('team');
    }

}]);