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
function(
    PLAYBOOK: any,
    $rootScope: any,
    $q: any,
    $state: any,
    __api: any,
    __localStorage: any) {

    var self = this;

    this.playbooks = [];

    this.browser = {
        open: function(id: number) {

        },
        drilldown: function(key: number) {

        },
        collapse: function() {
            console.info('collapse playbook browser');
            $rootScope.$broadcast('playbook-browser.collapse', {});
        },
        toggle: function() {
            console.log('toggle playbook browser');
            $rootScope.$broadcast('playbook-browser.toggle', {});
        }
    }

    this.editor = {
        openCallback: function(id: number, parentId: number) { },
        onOpen: function(callback: any) {
            self.editor.openCallback = callback;
        },
        open: function(id: number, parentId: number) {

        }
    }

    // retrieves all playbook data
    // TODO: implement *for the given user*
    this.getPlaybooks = function() {

        var d = $q.defer();

        __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOKS))
            .then(function(response: any) {
                let playbooks = Common.Utilities.parseData(response.data.results);
                let collection = new Playbook.Models.PlaybookModelCollection();
                collection.fromJson(playbooks);

                d.resolve(collection);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

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

    this.createPlaybook = function(data) {
        var d = $q.defer();

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_PLAYBOOK),
            data
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let playbook = new Playbook.Models.PlaybookModel();
                if(results && results.data && results.data.model) {
                    playbook.fromJson(results.data.model);    
                } else {
                    throw new Error('CreatePlaybook did not return a valid playbook model');
                }
                
                d.resolve(playbook);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    this.deletePlaybook = function(data) {
        var d = $q.defer();

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_PLAYBOOK),
            data
        )
            .then(function(response: any) {
                let playbook = Common.Utilities.parseData(response.data.results);
                d.resolve(playbook);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    this.createFormation = function(newFormation: Playbook.Models.Formation) {
        var d = $q.defer();

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

                impakt.context.Playbook.formations.add(
                    formationModel.guid,
                    formationModel
                );

                d.resolve(formationModel);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    this.deleteFormation = function(formation: Playbook.Models.Formation) {
        var d = $q.defer();

        __api.post(
            __api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_FORMATION),
            {
                key: formation.key
            }
        )
            .then(function(response: any) {
                let formationKey = response.data.results.key;
                $rootScope.$broadcast(
                    'playbook.deleteFormation',
                    formationKey
                );
                impakt.context.Playbook.formations.remove(formation.guid);
                d.resolve(formationKey);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    this.getFormations = function(playbook) {
        var d = $q.defer();
        __api.get(__api.path(
            PLAYBOOK.ENDPOINT,
            PLAYBOOK.GET_FORMATIONS,
            '?$filter=ParentRK eq ' + playbook.key))
            .then(function(response: any) {
                let formations = Common.Utilities.parseData(response.data.results);

                let collection = new Playbook.Models.FormationCollection();
                collection.fromJson(formations);

                d.resolve(collection);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    this.getFormation = function(key) {
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

    this.updateFormation = function(formation) {
        var d = $q.defer();

        // update assignment collection to json object
        let formationData = formation.toJson();

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
                let formations = Common.Utilities.parseData(response.data.results);
                d.resolve(formations);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    this.getSets = function(playbook) {
        throw new Error('playbook.srv getSets() Not implemented');
    }

    this.createSet = function(set) {
        var d = $q.defer();

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

                d.resolve(null);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    this.createPlay = function(play) {
        var d = $q.defer();

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
                    play: play
                }
            }
        )
        .then(function(response: any) {
            
            d.resolve(response);
            
        }, function(error: any) {
            d.reject(error);
        });

        return d.promise;
    }

    this.getPlays = function() {
        var d = $q.defer();
        __api.get(
            __api.path(
                PLAYBOOK.ENDPOINT,
                PLAYBOOK.GET_PLAYS
            )
        )
        .then(function(response: any) {
            let data = Common.Utilities.parseData(response.data.results);
            console.log(data);
            d.resolve(data);
        }, function(error: any) {
            d.reject(error);
        });

        return d.promise;
    }

}]);