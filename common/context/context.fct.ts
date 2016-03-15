/// <reference path='./context.mdl.ts' />

impakt.common.context.factory('__context', 
['$q', 
'__api',
'__localStorage',
'__notifications',
'PLAYBOOK',
	function(
		$q: any, 
		__api: any, 
		__localStorage: any,
		__notifications: any, 
		PLAYBOOK: any) {

	var self = {
		initialize: initialize
	}

	function initialize(context) {
		var d = $q.defer();
		console.log('Making application context initialization requests');

		if (!context.Playbook)
			context.Playbook = {};

		context.Playbook.positionDefaults = new Playbook.Models.PositionDefault();
		context.Playbook.unitTypes = getUnitTypes();
		context.Playbook.unitTypesEnum = getUnitTypesEnum();

		async.parallel([
			// Retrieve playbooks
			function(callback) {
				getPlaybooks().then(function(playbooks) {
					context.Playbook.playbooks = playbooks;
					__notifications.notify(
						'Playbooks successfully loaded',
						Common.Models.NotificationType.Success
					);
					callback(null, playbooks);
				}, function(err) {
					callback(err);
				});
			},
			// Retrieve formations
			function(callback) {
				getFormations().then(function(formations) {
					context.Playbook.formations = formations;
					__notifications.notify(
						'Formations successfully loaded',
						Common.Models.NotificationType.Success
					);
					callback(null, formations);
				}, function(err) {
					callback(err);
				});
			},
			// Retrieve personnel sets
			function(callback) {
				getPlaybookDataSets().then(function(personnel, assignments) {
					context.Playbook.personnel = personnel;
					context.Playbook.assignments = assignments;
					__notifications.notify(
						'Personnel successfully loaded',
						Common.Models.NotificationType.Success
					);
					__notifications.notify(
						'Assignments successfully loaded',
						Common.Models.NotificationType.Success
					);
					callback(null, personnel, assignments);
				}, function(err) {
					callback(err);
				});
			}],

			// Final callback
			function(err, results) {
				if(err) {
					d.reject(err);
				} else {
					__notifications.notify(
						'Initial data loaded successfully',
						Common.Models.NotificationType.Success
					);
					d.resolve(context);
				}
			});

		return d.promise;
	}

	function getUnitTypes() {
		return new Playbook.Models.UnitTypeCollection();
	}
	
	function getUnitTypesEnum() {
		let typeEnums = {};
		for (let unitType in Playbook.Editor.UnitTypes) {
			if (unitType >= 0)
				typeEnums[parseInt(unitType)]
					= Common.Utilities.camelCaseToSpace(
						Playbook.Editor.UnitTypes[unitType], true);
		}
		return typeEnums;
	}

	function getPlaybooks() {
		var d = $q.defer();

        __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOKS))
            .then(function(response: any) {

				if (response && response.data && response.data.results) {
					
					let playbookResults = Common.Utilities.parseData(response.data.results);
					
					for (let i = 0; i < playbookResults.length; i++) {
						let playbookResult = playbookResults[i];
						
						if(playbookResult && playbookResult.data && playbookResult.data.model) {			
							let playbookModel = new Playbook.Models.PlaybookModel();
							playbookResult.data.model.key = playbookResult.key;
							playbookModel.fromJson(playbookResult.data.model);
							
							let contextUnitType = 
							<Playbook.Models.UnitType>impakt.context.Playbook.unitTypes.getByUnitType(
								playbookModel.unitType
							);

							if(contextUnitType && contextUnitType.playbooks) {
								contextUnitType.playbooks.add<Playbook.Models.PlaybookModel>(
									playbookModel.guid,
									playbookModel
								);
							}
						}
					}
				}

				let playbookCollection = impakt.context.Playbook.unitTypes.getAllPlaybooks();

				// High fiv3
                d.resolve(playbookCollection);

            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
	}

	/**
	 * Retrieve all formations for use throughout the application
	 */
	function getFormations() {

		let playbookKey = __localStorage.getDefaultPlaybookKey();
		let playbookUnitType = __localStorage.getDefaultPlaybookUnitType();

		var d = $q.defer();
        __api.get(__api.path(
            PLAYBOOK.ENDPOINT,
            PLAYBOOK.GET_FORMATIONS,
            '?$filter=ParentRK gt 0'))
            .then(function(response: any) {
                let results = Common.Utilities.parseData(response.data.results);

                let formations = [];
                for(let i = 0; i < results.length; i++) {
					let result = results[i];
					if(result && result.data && result.data.formation) {
						let formation = result.data.formation;
						formation.key = result.key;
						formations.push(formation);
					} else {
						throw new Error('An invalid formation was retrieved');
					}
                }
                let collection = new Playbook.Models.FormationCollection();
                collection.fromJson(formations);

                collection.forEach(function(formation, index) {

                });

                d.resolve(collection);
            }, function(error: any) {
                d.reject(error);
            });

        return d.promise;
	}

	/**
	 * Retrieve all personnel sets for use throughout the application
	 */
	function getPlaybookDataSets() {
		var d = $q.defer();
		__api.get(__api.path(
			PLAYBOOK.ENDPOINT,
			PLAYBOOK.GET_SETS)
		)
			.then(function(response: any) {
				let results = Common.Utilities.parseData(response.data.results);

				let personnelResults = [];
				let assignmentResults = [];
				// get personnel & assignments from `sets`
				for (var i = 0; i < results.length; i++) {
					let result = results[i];
					if (result && result.data) {
						let data = result.data;
						switch (data.setType) {
							case Playbook.Editor.PlaybookSetTypes.Personnel:
								data.personnel.key = result.key;
								personnelResults.push(data.personnel);
								break;
							case Playbook.Editor.PlaybookSetTypes.Assignment:
								data.assignment.key = result.key;
								assignmentResults.push(data.assignment);
								break;
						}
					}
				}

				let personnelCollection = new Playbook.Models.PersonnelCollection();
				let assignmentCollection = new Playbook.Models.AssignmentCollection();

				for (let i = 0; i < personnelResults.length; i++) {
					let personnel = personnelResults[i];
					let personnelModel = new Playbook.Models.Personnel();
					personnelModel.fromJson(personnel);
					personnelCollection.add(personnelModel.guid, personnelModel);
				}
				for (let i = 0; i < assignmentResults.length; i++) {
					let assignment = assignmentResults[i];
					let assignmentModel = new Playbook.Models.Assignment();
					assignmentModel.fromJson(assignment);
					assignmentCollection.add(assignmentModel.guid, assignmentModel);
				}
							
				d.resolve(personnelCollection, assignmentCollection);
			}, function(error: any) {
				d.reject(error);
			});

		return d.promise;
	}

	return self;
}]);
