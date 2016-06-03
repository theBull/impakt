/// <reference path='./planning.ts' />

// Planning service
impakt.planning.service('_planning', [
'PLANNING',
'$rootScope',
'$q',
'$state',
'__api',
'__localStorage',
'__notifications',
'_planningModals',
function(
    PLANNING: any,
    $rootScope: any,
    $q: any,
    $state: any,
    __api: any,
    __localStorage: any,
    __notifications: any,
    _planningModals: any) {

    var self = this;

    this.drilldown = {
        plan: null
    }

    /**
     * Retrieves all Plans
     */
    this.getPlans = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting  plans...'
        );

        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_PLANS))
            .then(function(response: any) {

                let collection = new Planning.Models.PlanCollection();

                if (response && response.data && response.data.results) {

                    let planResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < planResults.length; i++) {
                        let planResult = planResults[i];

                        if (planResult && planResult.data && planResult.data.plan) {
                            let planModel = new Planning.Models.Plan();
                            planResult.data.plan.key = planResult.key;
                            planModel.fromJson(planResult.data.plan);

                            collection.add(planModel);
                        }
                    }
                }

                notification.success([collection.size(), ' plans successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve plans');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single Plan with the given key
     * @param {number} key The key of the Plan to retrieve
     */
    this.getPlan = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_PLAN, '/' + key))
            .then(function(response: any) {
                let plan = Common.Utilities.parseData(response.data.results);

                d.resolve(plan);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }


    /**
     * Sends a Plan model to the server for storage
     * @param {Common.Models.Plan} newPlan The Plan to be created/saved
     */
    this.createPlan = function(newPlan: Planning.Models.Plan) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newPlan)) {
            let nameExists = impakt.context.Planning.plans.hasElementWhich(
                function(planModel: Planning.Models.Plan, index: number) {
                    return planModel.name == newPlan.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create plan. Plan "', newPlan.name, '" already exists.');
                _planningModals.createPlanDuplicate(newPlan);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newPlan.key = -1;
        let planModelJson = newPlan.toJson();
        let notification = __notifications.pending(
            'Creating plan "', newPlan.name, '"...'
        );
        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.CREATE_PLAN),
            {
                version: 1,
                name: newPlan.name,
                data: {
                    version: 1,
                    plan: planModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let planModel = new Planning.Models.Plan();

                if (results && results.data && results.data.plan) {
                    results.data.plan.key = results.key;
                    planModel.fromJson(results.data.plan);

                    // update the context
                    impakt.context.Planning.plans.add(planModel);

                } else {
                    throw new Error('createPlan did not return a valid Plan');
                }

                notification.success(
                    'Successfully created plan "', planModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', planModel);

                d.resolve(planModel);
            }, function(error: any) {
                notification.error('Failed to create plan "', newPlan.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given Plan for the current user
     * @param {Planning.Models.Plan} Plan The Plan to be deleted
     */
    this.deletePlan = function(plan: Planning.Models.Plan) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting plan "', plan.name, '"...'
        );

        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.DELETE_PLAN),
            { key: plan.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.Planning.plans.remove(plan.guid);

            notification.success('Deleted plan "', plan.name, '"');

            self.toBrowser();

            d.resolve(plan);
        }, function(error: any) {
            notification.error('Failed to delete plan "', plan.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given Plan for the current user
     * @param {Planning.Models.Plan} Plan The Plan to update
     */
    this.updatePlan = function(plan: Planning.Models.Plan) {
        var d = $q.defer();

        // update assignment collection to json object
        let planJson = plan.toJson();

        let notification = __notifications.pending('Updating plan "', plan.name, '"...');

        __api.post(__api.path(
            PLANNING.ENDPOINT,
            PLANNING.UPDATE_PLAN),
            {
                version: 1,
                name: planJson.name,
                key: planJson.key,
                data: {
                    version: 1,
                    key: planJson.key,
                    plan: planJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let planModel = new Planning.Models.Plan();
                if (results && results.data && results.data.plan) {
                    planModel.fromJson(results.data.plan);

                    // update the context
                    impakt.context.Planning.plans.set(planModel.guid, planModel);
                }

                notification.success('Successfully updated plan "', plan.name, '"');

                d.resolve(planModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update plan "', plan.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }


    /**
     * Retrieves all practicePlans
     */
    this.getPracticePlans = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting practice plans...'
        );

        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_PRACTICEPLANS))
            .then(function(response: any) {

                let collection = new Planning.Models.PracticePlanCollection();

                if (response && response.data && response.data.results) {

                    let practicePlanResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < practicePlanResults.length; i++) {
                        let practicePlanResult = practicePlanResults[i];

                        if (practicePlanResult && practicePlanResult.data && practicePlanResult.data.practicePlan) {
                            let practicePlanModel = new Planning.Models.PracticePlan();
                            practicePlanResult.data.practicePlan.key = practicePlanResult.key;
                            practicePlanModel.fromJson(practicePlanResult.data.practicePlan);

                            collection.add(practicePlanModel);
                        }
                    }
                }

                notification.success([collection.size(), ' practice plans successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve practice plans');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single practicePlan with the given key
     * @param {number} key The key of the practicePlan to retrieve
     */
    this.getPracticePlan = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_PRACTICEPLAN, '/' + key))
            .then(function(response: any) {
                let practicePlan = Common.Utilities.parseData(response.data.results);

                d.resolve(practicePlan);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }
    

    /**
     * Sends a PracticePlan model to the server for storage
     * @param {Common.Models.PracticePlan} newPracticePlan The PracticePlan to be created/saved
     */
    this.createPracticePlan = function(newPracticePlan: Planning.Models.PracticePlan) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newPracticePlan)) {
            let nameExists = impakt.context.Planning.practicePlans.hasElementWhich(
                function(PracticePlanModel: Planning.Models.PracticePlan, index: number) {
                    return PracticePlanModel.name == newPracticePlan.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create practice plan. Practice plan "', newPracticePlan.name, '" already exists.');
                _planningModals.createPracticePlanDuplicate(newPracticePlan);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newPracticePlan.key = -1;
        let practicePlanModelJson = newPracticePlan.toJson();
        let notification = __notifications.pending(
            'Creating practice plan "', newPracticePlan.name, '"...'
        );
        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.CREATE_PRACTICEPLAN),
            {
                version: 1,
                name: newPracticePlan.name,
                data: {
                    version: 1,
                    practicePlan: practicePlanModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let practicePlanModel = new Planning.Models.PracticePlan();

                if (results && results.data && results.data.practicePlan) {
                    results.data.practicePlan.key = results.key;
                    practicePlanModel.fromJson(results.data.practicePlan);

                    // update the context
                    impakt.context.Planning.practicePlans.add(practicePlanModel);

                } else {
                    throw new Error('createPracticePlan did not return a valid PracticePlan');
                }

                notification.success(
                    'Successfully created practice plan "', practicePlanModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', practicePlanModel);

                d.resolve(practicePlanModel);
            }, function(error: any) {
                notification.error('Failed to create practice plan "', newPracticePlan.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given PracticePlan for the current user
     * @param {Planning.Models.PracticePlan} PracticePlan The PracticePlan to be deleted
     */
    this.deletePracticePlan = function(practicePlan: Planning.Models.PracticePlan) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting practice plan "', practicePlan.name, '"...'
        );

        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.DELETE_PRACTICEPLAN),
            { key: practicePlan.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.Planning.practicePlans.remove(practicePlan.guid);

            notification.success('Deleted practice plan "', practicePlan.name, '"');

            d.resolve(practicePlan);
        }, function(error: any) {
            notification.error('Failed to delete practice plan "', practicePlan.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given PracticePlan for the current user
     * @param {Planning.Models.PracticePlan} PracticePlan The PracticePlan to update
     */
    this.updatePracticePlan = function(practicePlan: Planning.Models.PracticePlan) {
        var d = $q.defer();

        // update assignment collection to json object
        let practicePlanJson = practicePlan.toJson();

        let notification = __notifications.pending('Updating practice plan "', practicePlan.name, '"...');

        __api.post(__api.path(
            PLANNING.ENDPOINT,
            PLANNING.UPDATE_PRACTICEPLAN),
            {
                version: 1,
                name: practicePlanJson.name,
                key: practicePlanJson.key,
                data: {
                    version: 1,
                    key: practicePlanJson.key,
                    practicePlan: practicePlanJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let practicePlanModel = new Planning.Models.PracticePlan();
                if (results && results.data && results.data.practicePlan) {
                    practicePlanModel.fromJson(results.data.practicePlan);

                    // update the context
                    impakt.context.Planning.practicePlans.set(practicePlanModel.guid, practicePlanModel);
                }

                notification.success('Successfully updated practice plan "', practicePlan.name, '"');

                d.resolve(practicePlanModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update practice plan "', practicePlan.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Retrieves all gamePlans
     */
    this.getGamePlans = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting game plans...'
        );

        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_GAMEPLANS))
            .then(function(response: any) {

                let collection = new Planning.Models.GamePlanCollection();

                if (response && response.data && response.data.results) {

                    let gamePlanResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < gamePlanResults.length; i++) {
                        let gamePlanResult = gamePlanResults[i];

                        if (gamePlanResult && gamePlanResult.data && gamePlanResult.data.gamePlan) {
                            let gamePlanModel = new Planning.Models.GamePlan();
                            gamePlanResult.data.gamePlan.key = gamePlanResult.key;
                            gamePlanModel.fromJson(gamePlanResult.data.gamePlan);

                            collection.add(gamePlanModel);
                        }
                    }
                }

                notification.success([collection.size(), ' game plans successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve game plans');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single gamePlan with the given key
     * @param {number} key The key of the gamePlan to retrieve
     */
    this.getGamePlan = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_GAMEPLAN, '/' + key))
            .then(function(response: any) {
                let gamePlan = Common.Utilities.parseData(response.data.results);

                d.resolve(gamePlan);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a gamePlan model to the server for storage
     * @param {Common.Models.GamePlan} newgamePlan The gamePlan to be created/saved
     */
    this.createGamePlan = function(newGamePlan: Planning.Models.GamePlan) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newGamePlan)) {
            let nameExists = impakt.context.Planning.gamePlans.hasElementWhich(
                function(gamePlanModel: Planning.Models.GamePlan, index: number) {
                    return gamePlanModel.name == newGamePlan.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create game plan. Game plan "', newGamePlan.name, '" already exists.');
                _planningModals.createGamePlanDuplicate(newGamePlan);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newGamePlan.key = -1;
        let gamePlanModelJson = newGamePlan.toJson();
        let notification = __notifications.pending(
            'Creating game plan "', newGamePlan.name, '"...'
        );
        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.CREATE_GAMEPLAN),
            {
                version: 1,
                name: newGamePlan.name,
                data: {
                    version: 1,
                    gamePlan: gamePlanModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let gamePlanModel = new Planning.Models.GamePlan();

                if (results && results.data && results.data.gamePlan) {
                    results.data.gamePlan.key = results.key;
                    gamePlanModel.fromJson(results.data.gamePlan);

                    // update the context
                    impakt.context.Planning.gamePlans.add(gamePlanModel);

                } else {
                    throw new Error('CreateGamePlan did not return a valid game plan');
                }

                notification.success(
                    'Successfully created game plan "', gamePlanModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', gamePlanModel);

                d.resolve(gamePlanModel);
            }, function(error: any) {
                notification.error('Failed to create game pl an "', newGamePlan.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given gamePlan for the current user
     * @param {Planning.Models.GamePlan} gamePlan The gamePlan to be deleted
     */
    this.deleteGamePlan = function(gamePlan: Planning.Models.GamePlan) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting game plan "', gamePlan.name, '"...'
        );

        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.DELETE_GAMEPLAN),
            { key: gamePlan.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.Planning.gamePlans.remove(gamePlan.guid);

            notification.success('Deleted game plan "', gamePlan.name, '"');

            d.resolve(gamePlan);
        }, function(error: any) {
            notification.error('Failed to delete game plan "', gamePlan.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given gamePlan for the current user
     * @param {Planning.Models.GamePlan} gamePlan The gamePlan to update
     */
    this.updateGamePlan = function(gamePlan: Planning.Models.GamePlan) {
        var d = $q.defer();

        // update assignment collection to json object
        let gamePlanJson = gamePlan.toJson();

        let notification = __notifications.pending('Updating gamePlan "', gamePlan.name, '"...');

        __api.post(__api.path(
            PLANNING.ENDPOINT,
            PLANNING.UPDATE_GAMEPLAN),
            {
                version: 1,
                name: gamePlanJson.name,
                key: gamePlanJson.key,
                data: {
                    version: 1,
                    key: gamePlanJson.key,
                    gamePlan: gamePlanJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let gamePlanModel = new Planning.Models.GamePlan();
                if (results && results.data && results.data.gamePlan) {
                    gamePlanModel.fromJson(results.data.gamePlan);

                    // update the context
                    impakt.context.Planning.gamePlans.set(gamePlanModel.guid, gamePlanModel);
                }

                notification.success('Successfully updated game plan "', gamePlan.name, '"');

                d.resolve(gamePlanModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update game plan "', gamePlan.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }


    /**
     * Retrieves all practice schedules
     */
    this.getPracticeSchedules = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting practice schedules...'
        );

        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_PRACTICESCHEDULES))
            .then(function(response: any) {

                let collection = new Planning.Models.PracticeScheduleCollection();

                if (response && response.data && response.data.results) {

                    let practiceScheduleResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < practiceScheduleResults.length; i++) {
                        let practiceScheduleResult = practiceScheduleResults[i];

                        if (practiceScheduleResult && practiceScheduleResult.data && practiceScheduleResult.data.practiceSchedule) {
                            let practiceScheduleModel = new Planning.Models.PracticeSchedule();
                            practiceScheduleResult.data.practiceSchedule.key = practiceScheduleResult.key;
                            practiceScheduleModel.fromJson(practiceScheduleResult.data.practiceSchedule);

                            collection.add(practiceScheduleModel);
                        }
                    }
                }

                notification.success([collection.size(), ' practice schedules successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve practice schedules');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single practiceSchedule with the given key
     * @param {number} key The key of the practiceSchedule to retrieve
     */
    this.getPracticeSchedule = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_PRACTICESCHEDULE, '/' + key))
            .then(function(response: any) {
                let practiceSchedule = Common.Utilities.parseData(response.data.results);

                d.resolve(practiceSchedule);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a practiceSchedule model to the server for storage
     * @param {Common.Models.PracticeSchedule} newPracticeSchedule The practiceSchedule to be created/saved
     */
    this.createPracticeSchedule = function(newPracticeSchedule: Planning.Models.PracticeSchedule) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newPracticeSchedule)) {
            let nameExists = impakt.context.Planning.practiceSchedules.hasElementWhich(
                function(practiceModel: Planning.Models.PracticeSchedule, index: number) {
                    return practiceModel.name == newPracticeSchedule.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create practice schedule. Practice schedule "', newPracticeSchedule.name, '" already exists.');
                _planningModals.createPracticeScheduleDuplicate(newPracticeSchedule);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newPracticeSchedule.key = -1;
        let practiceModelJson = newPracticeSchedule.toJson();
        let notification = __notifications.pending(
            'Creating practiceSchedule "', newPracticeSchedule.name, '"...'
        );
        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.CREATE_PRACTICESCHEDULE),
            {
                version: 1,
                name: newPracticeSchedule.name,
                data: {
                    version: 1,
                    practiceSchedule: practiceModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let practiceScheduleModel = new Planning.Models.PracticeSchedule();

                if (results && results.data && results.data.practiceSchedule) {
                    results.data.practiceSchedule.key = results.key;
                    practiceScheduleModel.fromJson(results.data.practiceSchedule);

                    // update the context
                    impakt.context.Planning.practiceSchedules.add(practiceScheduleModel);

                } else {
                    throw new Error('CreatePracticeSchedule did not return a valid practiceSchedule');
                }

                notification.success(
                    'Successfully created practice schedule "', practiceScheduleModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', practiceScheduleModel);

                d.resolve(practiceScheduleModel);
            }, function(error: any) {
                notification.error('Failed to create practice schedule "', newPracticeSchedule.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given practiceSchedule for the current user
     * @param {Planning.Models.PracticeSchedule} practiceSchedule The practiceSchedule to be deleted
     */
    this.deletePracticeSchedule = function(practiceSchedule: Planning.Models.PracticeSchedule) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting practice schedule "', practiceSchedule.name, '"...'
        );

        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.DELETE_PRACTICESCHEDULE),
            { key: practiceSchedule.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.Planning.practiceSchedules.remove(practiceSchedule.guid);

            notification.success('Deleted practice schedule "', practiceSchedule.name, '"');

            d.resolve(practiceSchedule);
        }, function(error: any) {
            notification.error('Failed to delete practice schedule "', practiceSchedule.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given practiceSchedule for the current user
     * @param {Planning.Models.PracticeSchedule} practiceSchedule The practiceSchedule to update
     */
    this.updatePracticeSchedule = function(practiceSchedule: Planning.Models.PracticeSchedule) {
        var d = $q.defer();

        // update assignment collection to json object
        let practiceScheduleJson = practiceSchedule.toJson();

        let notification = __notifications.pending('Updating practice schedule "', practiceSchedule.name, '"...');

        __api.post(__api.path(
            PLANNING.ENDPOINT,
            PLANNING.UPDATE_PRACTICESCHEDULE),
            {
                version: 1,
                name: practiceScheduleJson.name,
                key: practiceScheduleJson.key,
                data: {
                    version: 1,
                    key: practiceScheduleJson.key,
                    practiceSchedule: practiceScheduleJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let practiceScheduleModel = new Planning.Models.PracticeSchedule();
                if (results && results.data && results.data.practiceSchedule) {
                    practiceScheduleModel.fromJson(results.data.practiceSchedule);

                    // update the context
                    impakt.context.Planning.practiceSchedules.set(practiceScheduleModel.guid, practiceScheduleModel);
                }

                notification.success('Successfully updated practice schedule "', practiceSchedule.name, '"');

                d.resolve(practiceScheduleModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update practice schedule "', practiceSchedule.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }


    /**
     * Retrieves all scout cards
     */
    this.getScoutCards = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting scout cards...'
        );

        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_SCOUTCARDS))
            .then(function(response: any) {

                let collection = new Planning.Models.ScoutCardCollection();

                if (response && response.data && response.data.results) {

                    let scoutCardResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < scoutCardResults.length; i++) {
                        let scoutCardResult = scoutCardResults[i];

                        if (scoutCardResult && scoutCardResult.data && scoutCardResult.data.scoutCard) {
                            let scoutCardModel = new Planning.Models.ScoutCard();
                            scoutCardResult.data.scoutCard.key = scoutCardResult.key;
                            scoutCardModel.fromJson(scoutCardResult.data.scoutCard);

                            collection.add(scoutCardModel);
                        }
                    }
                }

                notification.success([collection.size(), ' scout cards successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve scout cards');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single scoutCard with the given key
     * @param {number} key The key of the scoutCard to retrieve
     */
    this.getScoutCard = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_SCOUTCARD, '/' + key))
            .then(function(response: any) {
                let scoutCard = Common.Utilities.parseData(response.data.results);

                d.resolve(scoutCard);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a scoutCard model to the server for storage
     * @param {Common.Models.ScoutCard} newScoutCard The scoutCard to be created/saved
     */
    this.createScoutCard = function(newScoutCard: Planning.Models.ScoutCard) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newScoutCard)) {
            let nameExists = impakt.context.Planning.scoutCards.hasElementWhich(
                function(scoutModel: Planning.Models.ScoutCard, index: number) {
                    return scoutModel.name == newScoutCard.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create scout card. Scout card "', newScoutCard.name, '" already exists.');
                _planningModals.createScoutCardDuplicate(newScoutCard);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newScoutCard.key = -1;
        let scoutModelJson = newScoutCard.toJson();
        let notification = __notifications.pending(
            'Creating scoutCard "', newScoutCard.name, '"...'
        );
        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.CREATE_SCOUTCARD),
            {
                version: 1,
                name: newScoutCard.name,
                data: {
                    version: 1,
                    scoutCard: scoutModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let scoutCardModel = new Planning.Models.ScoutCard();

                if (results && results.data && results.data.scoutCard) {
                    results.data.scoutCard.key = results.key;
                    scoutCardModel.fromJson(results.data.scoutCard);

                    // update the context
                    impakt.context.Planning.scoutCards.add(scoutCardModel);

                } else {
                    throw new Error('CreateScoutCard did not return a valid scoutCard');
                }

                notification.success(
                    'Successfully created scout card "', scoutCardModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', scoutCardModel);

                d.resolve(scoutCardModel);
            }, function(error: any) {
                notification.error('Failed to create scout card "', newScoutCard.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given scoutCard for the current user
     * @param {Planning.Models.ScoutCard} scoutCard The scoutCard to be deleted
     */
    this.deleteScoutCard = function(scoutCard: Planning.Models.ScoutCard) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting scout card "', scoutCard.name, '"...'
        );

        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.DELETE_SCOUTCARD),
            { key: scoutCard.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.Planning.scoutCards.remove(scoutCard.guid);

            notification.success('Deleted scout card "', scoutCard.name, '"');

            d.resolve(scoutCard);
        }, function(error: any) {
            notification.error('Failed to delete scout card "', scoutCard.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given scoutCard for the current user
     * @param {Planning.Models.ScoutCard} scoutCard The scoutCard to update
     */
    this.updateScoutCard = function(scoutCard: Planning.Models.ScoutCard) {
        var d = $q.defer();

        // update assignment collection to json object
        let scoutCardJson = scoutCard.toJson();

        let notification = __notifications.pending('Updating scout card "', scoutCard.name, '"...');

        __api.post(__api.path(
            PLANNING.ENDPOINT,
            PLANNING.UPDATE_SCOUTCARD),
            {
                version: 1,
                name: scoutCardJson.name,
                key: scoutCardJson.key,
                data: {
                    version: 1,
                    key: scoutCardJson.key,
                    scoutCard: scoutCardJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let scoutCardModel = new Planning.Models.ScoutCard();
                if (results && results.data && results.data.scoutCard) {
                    scoutCardModel.fromJson(results.data.scoutCard);

                    // update the context
                    impakt.context.Planning.scoutCards.set(scoutCardModel.guid, scoutCardModel);
                }

                notification.success('Successfully updated scout card "', scoutCard.name, '"');

                d.resolve(scoutCardModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update scout card "', scoutCard.name, '"'
                );

                d.reject(error);
            });

        return d.promise;
    }


    /**
     * Retrieves all QB wristbands
     */
    this.getQBWristbands = function() {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Getting QB wristbands...'
        );

        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_QBWRISTBANDS))
            .then(function(response: any) {

                let collection = new Planning.Models.QBWristbandCollection();

                if (response && response.data && response.data.results) {

                    let QBWristbandResults = Common.Utilities.parseData(response.data.results);


                    for (let i = 0; i < QBWristbandResults.length; i++) {
                        let QBWristbandResult = QBWristbandResults[i];

                        if (QBWristbandResult && QBWristbandResult.data && QBWristbandResult.data.QBWristband) {
                            let QBWristbandModel = new Planning.Models.QBWristband();
                            QBWristbandResult.data.QBWristband.key = QBWristbandResult.key;
                            QBWristbandModel.fromJson(QBWristbandResult.data.QBWristband);

                            collection.add(QBWristbandModel);
                        }
                    }
                }

                notification.success([collection.size(), ' QB wristbands successfully retreived'].join(''));

                d.resolve(collection);

            }, function(error: any) {
                notification.error('Failed to retieve QB wristbands');
                console.error(error);
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Gets a single QBWristband with the given key
     * @param {number} key The key of the QBWristband to retrieve
     */
    this.getQBWristband = function(key: number) {
        var d = $q.defer();
        __api.get(__api.path(PLANNING.ENDPOINT, PLANNING.GET_QBWRISTBAND, '/' + key))
            .then(function(response: any) {
                let QBWristband = Common.Utilities.parseData(response.data.results);

                d.resolve(QBWristband);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Sends a QBWristband model to the server for storage
     * @param {Common.Models.QBWristband} newQBWristband The QBWristband to be created/saved
     */
    this.createQBWristband = function(newQBWristband: Planning.Models.QBWristband) {
        var d = $q.defer();

        if (Common.Utilities.isNotNullOrUndefined(newQBWristband)) {
            let nameExists = impakt.context.Planning.QBWristbands.hasElementWhich(
                function(QBModel: Planning.Models.QBWristband, index: number) {
                    return QBModel.name == newQBWristband.name;
                });
            if (nameExists) {
                let notification = __notifications.warning(
                    'Failed to create QB wristband. QB wristband "', newQBWristband.name, '" already exists.');
                _planningModals.createQBWristbandDuplicate(newQBWristband);
                return;
            }
        }
        // set key to -1 to ensure a new object is created server-side
        newQBWristband.key = -1;
        let QBModelJson = newQBWristband.toJson();
        let notification = __notifications.pending(
            'Creating QBWristband "', newQBWristband.name, '"...'
        );
        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.CREATE_QBWRISTBAND),
            {
                version: 1,
                name: newQBWristband.name,
                data: {
                    version: 1,
                    QBWristband: QBModelJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let QBWristbandModel = new Planning.Models.QBWristband();

                if (results && results.data && results.data.QBWristband) {
                    results.data.QBWristband.key = results.key;
                    QBWristbandModel.fromJson(results.data.QBWristband);

                    // update the context
                    impakt.context.Planning.QBWristbands.add(QBWristbandModel);

                } else {
                    throw new Error('CreateQBWristband did not return a valid QBWristband');
                }

                notification.success(
                    'Successfully created QB wristband "', QBWristbandModel.name, '"'
                );

                $rootScope.$broadcast('create-entity', QBWristbandModel);

                d.resolve(QBWristbandModel);
            }, function(error: any) {
                notification.error('Failed to create QB wristband "', newQBWristband.name, '"');
                d.reject(error);
            });

        return d.promise;
    }

    /**
     * Deletes the given QBWristband for the current user
     * @param {Planning.Models.QBWristband} QBWristband The QBWristband to be deleted
     */
    this.deleteQBWristband = function(QBWristband: Planning.Models.QBWristband) {
        var d = $q.defer();

        let notification = __notifications.pending(
            'Deleting QB wristband "', QBWristband.name, '"...'
        );

        __api.post(
            __api.path(PLANNING.ENDPOINT, PLANNING.DELETE_QBWRISTBAND),
            { key: QBWristband.key }
        ).then(function(response: any) {
            // update the context
            impakt.context.Planning.QBWristbands.remove(QBWristband.guid);

            notification.success('Deleted QB wristband "', QBWristband.name, '"');

            d.resolve(QBWristband);
        }, function(error: any) {
            notification.error('Failed to delete QB wristband "', QBWristband.name, '"');
            d.reject(error);
        });

        return d.promise;
    }

    /**
     * Updates the given QBWristband for the current user
     * @param {Planning.Models.QBWristband} QBWristband The QBWristband to update
     */
    this.updateQBWristband = function(QBWristband: Planning.Models.QBWristband) {
        var d = $q.defer();

        // update assignment collection to json object
        let QBWristbandJson = QBWristband.toJson();

        let notification = __notifications.pending('Updating QB wristband "', QBWristband.name, '"...');

        __api.post(__api.path(
            PLANNING.ENDPOINT,
            PLANNING.UPDATE_QBWRISTBAND),
            {
                version: 1,
                name: QBWristbandJson.name,
                key: QBWristbandJson.key,
                data: {
                    version: 1,
                    key: QBWristbandJson.key,
                    QBWristband: QBWristbandJson
                }
            }
        )
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);
                let QBWristbandModel = new Planning.Models.QBWristband();
                if (results && results.data && results.data.QBWristband) {
                    QBWristbandModel.fromJson(results.data.QBWristband);

                    // update the context
                    impakt.context.Planning.QBWristbands.set(QBWristbandModel.guid, QBWristbandModel);
                }

                notification.success('Successfully updated QB wristband "', QBWristband.name, '"');

                d.resolve(QBWristbandModel);
            }, function(error: any) {
                notification.error(
                    'Failed to update QB wristband "', QBWristband.name, '"'
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
            case Common.Enums.ImpaktDataTypes.Plan:
                return _planningModals.deletePlan(entity);

            case Common.Enums.ImpaktDataTypes.PracticePlan:
                return _planningModals.deletePracticePlan(entity);

            case Common.Enums.ImpaktDataTypes.GamePlan:
                return _planningModals.deleteGamePlan(entity);

            case Common.Enums.ImpaktDataTypes.PracticeSchedule:
                return _planningModals.deletePracticeSchedule(entity);

            case Common.Enums.ImpaktDataTypes.ScoutCard:
                return _planningModals.deleteScoutCard(entity);

            case Common.Enums.ImpaktDataTypes.QBWristband:
                return _planningModals.deleteQBWristband(entity);

            default:
                d.reject(new Error('_planning deleteEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise;
    }

    this.updateEntityByType = function(entity: Common.Interfaces.IActionable): void {
        if (Common.Utilities.isNullOrUndefined(entity))
            return;

        let d = $q.defer();

        switch(entity.impaktDataType) {

            case Common.Enums.ImpaktDataTypes.Plan:
                return _planningModals.savePlan(entity);

            case Common.Enums.ImpaktDataTypes.PracticePlan:
                return _planningModals.savePracticePlan(entity);

            case Common.Enums.ImpaktDataTypes.GamePlan:
                return _planningModals.saveGamePlan(entity);

            case Common.Enums.ImpaktDataTypes.PracticeSchedule:
                return _planningModals.savePracticeSchedule(entity);

            case Common.Enums.ImpaktDataTypes.ScoutCard:
                return _planningModals.saveScoutCard(entity);

            case Common.Enums.ImpaktDataTypes.QBWristband:
                return _planningModals.saveQBWristband(entity);
            
            default:
                d.reject(new Error('_planning saveEntityByType: impaktDataType not supported'));
                break;
        }

        return d.promise;
    }

    this.toBrowser = function() {
        $state.transitionTo('planning.browser');
    }

    this.toPracticePlanEditor = function(practicePlan: Planning.Models.PracticePlan): void {
        impakt.context.Planning.editor.practicePlans.add(practicePlan);
        $state.transitionTo('planning.editor.practicePlan');
    }

    this.toGamePlanEditor = function(gamePlan: Planning.Models.GamePlan): void {
        impakt.context.Planning.editor.gamePlans.add(gamePlan);
        $state.transitionTo('planning.editor');
    }

    this.toPracticeScheduleEditor = function(practiceSchedule: Planning.Models.PracticeSchedule): void {
        impakt.context.Planning.editor.practiceSchedules.add(practiceSchedule);
        $state.transitionTo('planning.editor');
    }

    this.toScoutCardEditor = function(scoutCard: Planning.Models.ScoutCard): void {        
        impakt.context.Planning.editor.scoutCards.add(scoutCard);
        $state.transitionTo('planning.editor');
    }

    this.toQBWristbandEditor = function(QBWristband: Planning.Models.QBWristband): void {
        impakt.context.Planning.editor.QBWristbands.add(QBWristband);
        $state.transitionTo('planning.editor');
    }

    this.toPlanDrilldown = function(plan: Planning.Models.Plan) {
        this.drilldown.plan = plan;
        impakt.context.Planning.plans.select(plan);
        //_deselectEntities(false); // TODO @theBull
        impakt.context.Actionable.selected.only(plan);
        $state.transitionTo('planning.drilldown.plan');
    }

    function _deselectEntities() {
        // TODO @theBull
    }

}]);