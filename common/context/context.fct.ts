/// <reference path='./context.mdl.ts' />

impakt.common.context.factory('__context', 
['$q', 
'__api',
'__localStorage',
'__notifications',
'_associations',
'_playbook',
'_league',
'_season',
'_team',
'_planning',
function(
	$q: any, 
	__api: any, 
	__localStorage: any,
	__notifications: any,
	_associations: any,
	_playbook: any,
	_league: any,
	_season: any,
	_team: any,
	_planning: any
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

	if (!impakt.context.Actionable)
		impakt.context.Actionable = {};

	if (!impakt.context.Organization)
		impakt.context.Organization = {};

	if (!impakt.context.Associations) {
		impakt.context.Associations = {};
	}

	if (!impakt.context.Playbook)
		impakt.context.Playbook = {};

	if (!impakt.context.Team)
		impakt.context.Team = {};

	if (!impakt.context.League)
		impakt.context.League = {};

	if (!impakt.context.Season)
		impakt.context.Season = {};

	if (!impakt.context.Planning)
		impakt.context.Planning = {};

	function initialize(context) {
		// notify listeners that context initialization
		// has begun
		initializing();

		var d = $q.defer();
		console.log('Making application context initialization requests');

		let organizationKey = __localStorage.getOrganizationKey();

		/**
		 *
		 * 
		 * Application-wide context data
		 *
		 * 
		 */

		/**
		 * Organization context
		 */
		// Set in user.srv
		// impakt.context.Organization.current = new User.Models.Organization();

		/**
		 *
		 *
		 * Actionable context
		 * 
		 * 
		 */
		impakt.context.Actionable.selected = new Common.Models.ActionableCollection<Common.Interfaces.IActionable>();

		/**
		 *
		 * 
		 * Association context
		 *
		 * 
		 */
		impakt.context.Associations.associations = new Common.Models.AssociationCollection(organizationKey);
		impakt.context.Associations.creation = new Common.Models.AssociationCollection(organizationKey);

		/**
		 *
		 * 
		 * Playbook context
		 *
		 * 
		 */
		impakt.context.Playbook.playbooks = new Common.Models.PlaybookModelCollection(Team.Enums.UnitTypes.Mixed);
		impakt.context.Playbook.formations = new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed);
		impakt.context.Playbook.assignmentGroups = new Common.Models.AssignmentGroupCollection(Team.Enums.UnitTypes.Mixed);
		impakt.context.Playbook.plays = new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed);
		impakt.context.Playbook.scenarios = new Common.Models.ScenarioCollection(Team.Enums.UnitTypes.Other);
		/**
		 * Module-specific context data; plays currently open in the editor
		 */
		impakt.context.Playbook.editor = {
			plays: new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed),
			tabs: new Common.Models.TabCollection(),
			scenarios: new Common.Models.ScenarioCollection(Team.Enums.UnitTypes.Other)
		}
		/**
		 * A creation context for new plays and formations.
		 */
		impakt.context.Playbook.creation = {
			plays: new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed),
			formations: new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed),
			scenarios: new Common.Models.ScenarioCollection(Team.Enums.UnitTypes.Other)
		}

		/**
		 *
		 * 
		 * Team context
		 * 
		 * 
		 */
		impakt.context.Team.teams = new Team.Models.TeamModelCollection();
		impakt.context.Team.personnel = new Team.Models.PersonnelCollection(Team.Enums.UnitTypes.Mixed);
		impakt.context.Team.positionDefaults = new Team.Models.PositionDefault();
		impakt.context.Team.unitTypes = _playbook.getUnitTypes();
		impakt.context.Team.unitTypesEnum = _playbook.getUnitTypesEnum();
		impakt.context.Team.creation = {
			teams: new Team.Models.TeamModelCollection()
		}

		/**
		 *
		 * 
		 * League context
		 *
		 * 
		 */
		impakt.context.League.leagues = new League.Models.LeagueModelCollection();
		impakt.context.League.conferences = new League.Models.ConferenceCollection();
		impakt.context.League.divisions = new League.Models.DivisionCollection();
		impakt.context.League.locations = new League.Models.LocationCollection();
		/**
		 * A creation context for new leagues, conferences, divisions, and teams
		 */
		impakt.context.League.creation = {
			leagues: new League.Models.LeagueModelCollection(),
			conferences: new League.Models.ConferenceCollection(),
			team: new Team.Models.TeamModel(),
			divisions: new League.Models.DivisionCollection(),
			locations: new League.Models.LocationCollection()
		}

		
		/**
		 *
		 * 
		 * Season context
		 *
		 * 
		 */
		impakt.context.Season.seasons = new Season.Models.SeasonModelCollection();
		impakt.context.Season.games = new Season.Models.GameCollection();
		/**
		 * A creation context for new seasons, games, and weeks
		 */
		impakt.context.Season.creation = {
			seasons: new Season.Models.SeasonModelCollection(),
			games: new Season.Models.GameCollection()
		}

		
		/**
		 *
		 * 
		 * Planning context
		 *
		 * 
		 */
		impakt.context.Planning.plans = new Planning.Models.PlanCollection();
		impakt.context.Planning.practicePlans = new Planning.Models.PracticePlanCollection();
		impakt.context.Planning.gamePlans = new Planning.Models.GamePlanCollection();
		impakt.context.Planning.practiceSchedules = new Planning.Models.PracticeScheduleCollection();
		impakt.context.Planning.scoutCards = new Planning.Models.ScoutCardCollection();
		impakt.context.Planning.QBWristbands = new Planning.Models.QBWristbandCollection();
	
		/**
		 * A creation context for planning
		 */
		impakt.context.Planning.creation = {
			plans: new Planning.Models.PlanCollection(),
			practicePlans: new Planning.Models.PracticePlanCollection(),
			gamePlans: new Planning.Models.GamePlanCollection(),
			practiceSchedules: new Planning.Models.PracticeScheduleCollection(),
			scoutCards: new Planning.Models.ScoutCardCollection(),
			QBWristbands: new Planning.Models.QBWristbandCollection()
		}
		impakt.context.Planning.editor = {
			practicePlans: new Planning.Models.PracticePlanCollection(),
			practiceSchedules: new Planning.Models.PracticeScheduleCollection(),
			gamePlans: new Planning.Models.GamePlanCollection(),
			scoutCards: new Planning.Models.ScoutCardCollection(),
			QBWristbands: new Planning.Models.QBWristbandCollection()
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

			// Retrieve conferences
			function(callback) {
				_league.getConferences().then(function(conferences) {
					context.League.conferences = conferences;
					__notifications.success('Conferences successfully loaded');
					callback(null, conferences);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve divisions
			function(callback) {
				_league.getDivisions().then(function(divisions) {
					context.League.divisions = divisions;
					__notifications.success('Divisions successfully loaded');
					callback(null, divisions);
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

			// Retrieve locations
			function(callback) {
				_league.getLocations().then(function(locations) {
					context.League.locations = locations;
					__notifications.success('Locations successfully loaded');
					callback(null, locations);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve seasons
			function(callback) {
				_season.getSeasons().then(function(seasons) {
					context.Season.seasons = seasons;
					__notifications.success('Seasons successfully loaded');
					callback(null, seasons);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve games
			function(callback) {
				_season.getGames().then(function(games) {
					context.Season.games = games;
					__notifications.success('Games successfully loaded');
					callback(null, games);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve plans
			function(callback) {
				_planning.getPlans().then(function(plans) {
					context.Planning.plans = plans;
					__notifications.success(' plans successfully loaded');
					callback(null, plans);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve practice plans
			function(callback) {
				_planning.getPracticePlans().then(function(practicePlans) {
					context.Planning.practicePlans = practicePlans;
					__notifications.success('Practice plans successfully loaded');
					callback(null, practicePlans);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve game plans
			function(callback) {
				_planning.getGamePlans().then(function(gamePlans) {
					context.Planning.gamePlans = gamePlans;
					__notifications.success('Game plans successfully loaded');
					callback(null, gamePlans);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve practice schedules
			function(callback) {
				_planning.getPracticeSchedules().then(function(practiceSchedules) {
					context.Planning.practiceSchedules = practiceSchedules;
					__notifications.success('Practice schedules successfully loaded');
					callback(null, practiceSchedules);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve scout cards
			function(callback) {
				_planning.getScoutCards().then(function(scoutCards) {
					context.Planning.scoutCards = scoutCards;
					__notifications.success('Scout cards successfully loaded');
					callback(null, scoutCards);
				}, function(err) {
					callback(err);
				});
			},

			// Retrieve QB wristbands
			function(callback) {
				_planning.getQBWristbands().then(function(QBWristbands) {
					context.Planning.QBWristbands = QBWristbands;
					__notifications.success('QB wristbands successfully loaded');
					callback(null, QBWristbands);
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

			// Retrieve assignment groups
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

			// Retrieve personnel groups
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
				});
			},

			// Retrieve scenarios
			function(callback) {
				_playbook.getScenarios().then(function(scenarios) {

					context.Playbook.scenarios = scenarios;

					__notifications.success('Scenarios successfully loaded');
					callback(null, scenarios);
				}, function(err) {
					callback(err);
				});
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
