/// <reference path='./context.mdl.ts' />

impakt.common.context.factory('__context', 
['$q', 
'__api',
'__localStorage',
'__notifications',
'_playbook',
function(
	$q: any, 
	__api: any, 
	__localStorage: any,
	__notifications: any,
	_playbook: any,
	_user: any) {

	var isReady = false;
	var readyCallbacks = [];
	function onReady(callback: Function) {
		readyCallbacks.push(callback);
		if (isReady)
			ready();
	}
	function ready() {
		isReady = true;
		for (let i = 0; i < readyCallbacks.length; i++) {
			readyCallbacks[i]();
		}
	}

	var self = {
		initialize: initialize,
		onReady: onReady
	}

	function initialize(context) {
		var d = $q.defer();
		console.log('Making application context initialization requests');

		if (!context.Playbook)
			context.Playbook = {};

		if(!context.Team)
			context.Team = {};

		/**
		 *
		 * 
		 * Application-wide context data
		 *
		 * 
		 */
		
		/**
		 * Playbook context
		 */
		context.Playbook.playbooks = new Common.Models.PlaybookModelCollection();
		context.Playbook.formations = new Common.Models.FormationCollection();
		context.Playbook.assignments = new Common.Models.AssignmentCollection();
		context.Playbook.plays = new Common.Models.PlayCollection();

		/**
		 * Team context
		 */
		context.Team.personnel = new Team.Models.PersonnelCollection();
		context.Team.positionDefaults = new Team.Models.PositionDefault();
		context.Team.unitTypes = _playbook.getUnitTypes();
		context.Team.unitTypesEnum = _playbook.getUnitTypesEnum();
		
		/**
		 * Module-specific context data; plays currently open in the editor
		 */
		context.Playbook.editor = {
			plays: new Common.Models.PlayCollection(),
			tabs: new Common.Models.TabCollection()
		}

		/**
		 * A creation context for new plays and formations.
		 */
		context.Playbook.creation = {
			plays: new Common.Models.PlayCollection(),
			formations: new Common.Models.FormationCollection()
		}

		async.parallel([
			
			// Retrieve playbooks
			function(callback) {
				_playbook.getPlaybooks().then(function(playbooks) {
					
					context.Playbook.playbooks = playbooks;
					
					__notifications.success('Playbooks successfully loaded');

					callback(null, playbooks);
					
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve formations
			function(callback) {
				_playbook.getFormations().then(function(formations) {
					
					context.Playbook.formations = formations;
					
					__notifications.success('Formations successfully loaded');
					callback(null, formations);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve personnel sets
			function(callback) {
				_playbook.getSets().then(function(results) {
					
					if(!Common.Utilities.isNullOrUndefined(results.personnel))
						context.Team.personnel = results.personnel;

					if (!Common.Utilities.isNullOrUndefined(results.assignments))
						context.Playbook.assignments = results.assignments;

					__notifications.success('Personnel successfully loaded');
					__notifications.success('Assignments successfully loaded');
					callback(null, results.personnel, results.assignments);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve plays
			function(callback) {
				_playbook.getPlays().then(function(plays) {

					context.Playbook.plays = plays;

					context.Playbook.plays.forEach(function(play, index) {
						let primaryAssociatedFormation = play.associated.formations.primary();
						if(primaryAssociatedFormation) {
							play.formation = context.Playbook.formations.get(primaryAssociatedFormation);
						}
						let primaryAssociatedPersonnel = play.associated.personnel.primary();
						if(primaryAssociatedPersonnel) {
							play.personnel = context.Team.personnel.get(primaryAssociatedPersonnel);
						}
					});
					
					__notifications.success('Plays successfully loaded');
					callback(null, plays);
				}, function(err) {
					callback(err);
				})
			}],

			// Final callback
			function(err, results) {
				if(err) {
					d.reject(err);
				} else {
					__notifications.success('Initial data loaded successfully');

					ready();

					d.resolve(context);
				}
			});

		return d.promise;
	}

	return self;
}]);
