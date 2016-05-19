/// <reference path='./context.mdl.ts' />

impakt.common.context.factory('__context', 
['$q', 
'__api',
'__localStorage',
'__notifications',
'_associations',
'_playbook',
'_league',
'_team',
function(
	$q: any, 
	__api: any, 
	__localStorage: any,
	__notifications: any,
	_associations: any,
	_playbook: any,
	_league: any,
	_team: any
) {

	var isReady = false;
	var readyCallbacks = [];
	var initializingCallbacks = [];
	function onReady(callback: Function) {
		readyCallbacks.push(callback);
		if (isReady)
			ready();
	}
	function onInitializing(callback: Function) {
		initializingCallbacks.push(callback);
	}
	function initializing() {
		for (let i = 0; i < initializingCallbacks.length; i++) {
			initializingCallbacks[i]();
		}
		initializingCallbacks = [];
	}
	function ready() {
		isReady = true;
		for (let i = 0; i < readyCallbacks.length; i++) {
			readyCallbacks[i]();
		}
		readyCallbacks = [];
	}

	var self = {
		initialize: initialize,
		onReady: onReady,
		onInitializing: onInitializing
	}

	function initialize(context) {
		// notify listeners that context initialization
		// has begun
		initializing();

		var d = $q.defer();
		console.log('Making application context initialization requests');

		let organizationKey = __localStorage.getOrganizationKey();

		if (!context.Associations) {
			context.Associations = {};
			context.Associations.associations = new Common.Models.AssociationCollection(organizationKey);
			context.Associations.creation = new Common.Models.AssociationCollection(organizationKey);
		}

		if (!context.Playbook)
			context.Playbook = {};

		if (!context.Team)
			context.Team = {};

		if (!context.League)
			context.League = {};

		/**
		 *
		 * 
		 * Application-wide context data
		 *
		 * 
		 */
		
		/**
		 * Association context
		 */
		// Already set
		
		/**
		 * Playbook context
		 */
		context.Playbook.playbooks = new Common.Models.PlaybookModelCollection(Team.Enums.UnitTypes.Mixed);
		context.Playbook.formations = new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed);
		context.Playbook.assignmentGroups = new Common.Models.AssignmentGroupCollection(Team.Enums.UnitTypes.Mixed);
		context.Playbook.plays = new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed);

		/**
		 * Team context
		 */
		context.Team.teams = new Team.Models.TeamModelCollection(Team.Enums.TeamTypes.Mixed);
		context.Team.personnel = new Team.Models.PersonnelCollection(Team.Enums.UnitTypes.Mixed);
		context.Team.positionDefaults = new Team.Models.PositionDefault();
		context.Team.unitTypes = _playbook.getUnitTypes();
		context.Team.unitTypesEnum = _playbook.getUnitTypesEnum();

		/**
		 * League context
		 */
		context.League.leagues = new League.Models.LeagueModelCollection();
		
		/**
		 * Module-specific context data; plays currently open in the editor
		 */
		context.Playbook.editor = {
			plays: new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed),
			tabs: new Common.Models.TabCollection()
		}

		/**
		 * A creation context for new plays and formations.
		 */
		context.Playbook.creation = {
			plays: new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed),
			formations: new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed)
		}

		async.parallel([
			
			// Retrieve associations
			function(callback) {
				// make requests to get all associations
				_associations.getAssociationsByContextId()
				.then(function(associations) {
					context.Associations.associations = associations;
					callback(null, associations);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve leagues
			function(callback) {
				_league.getLeagues().then(function(leagues) {
					context.League.leagues = leagues;
					__notifications.success('Leagues successfully loaded');
					callback(null, leagues);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve teams
			function(callback) {
				_team.getTeams().then(function(teams) {
					context.Team.teams = teams;
					__notifications.success('Teams successfully loaded');
					callback(null, teams);
				}, function(err) {
					callback(err);
				});
			},

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
				_playbook.getAssignmentGroups()
				.then(function(assignmentGroupCollection: Common.Models.AssignmentGroupCollection) {
					if (Common.Utilities.isNotNullOrUndefined(assignmentGroupCollection))
						context.Playbook.assignmentGroups = assignmentGroupCollection;

					
					__notifications.success('Assignments successfully loaded');
					callback(null, assignmentGroupCollection);
				}, function(err) {
					callback(err);
				});
			},

			function(callback) {
				_team.getPersonnel().then(function(personnelCollection: Team.Models.PersonnelCollection) {
					if (Common.Utilities.isNotNullOrUndefined(personnelCollection))
						context.Team.personnel = personnelCollection;

					__notifications.success('Personnel successfully loaded');
					callback(null, personnelCollection);
				}, function(err: any) {
					callback(err);
				});
			},

			// Retrieve plays
			function(callback) {
				_playbook.getPlays().then(function(plays) {

					context.Playbook.plays = plays;
					
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
