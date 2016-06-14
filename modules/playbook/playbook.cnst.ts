/// <reference path='./playbook.mdl.ts' />
/**
 * Playbook constants defined here
 */

impakt.playbook.constant('PLAYBOOK', {
    //GET_PLAYBOOKS: 'data/playbook.json',
    ENDPOINT: '/playbook',
    
    // Playbooks
    CREATE_PLAYBOOK: '/createPlaybook',
    GET_PLAYBOOKS: '/getPlaybooks',
    GET_PLAYBOOK: '/getPlaybook',
    DELETE_PLAYBOOK: '/deletePlaybook',
    UPDATE_PLAYBOOK: '/updatePlaybook',

    // Formations
    CREATE_FORMATION: '/createFormation',
    GET_FORMATIONS: '/getFormations',
    GET_FORMATION: '/getFormation',
    DELETE_FORMATION: '/deleteFormation',
    UPDATE_FORMATION: '/updateFormation',

    // Assignments
    CREATE_ASSIGNMENTGROUP: '/createAssignmentGroup',
    GET_ASSIGNMENTGROUPS: '/getAssignmentGroups',
    UPDATE_ASSIGNMENTGROUP: '/updateAssignmentGroup',
    DELETE_ASSIGNMENTGROUP: '/deleteAssignmentGroup',

    // Plays
    CREATE_PLAY: '/createPlay',
    UPDATE_PLAY: '/updatePlay',
    GET_PLAY: '/getPlay',
    GET_PLAYS: '/getPlays',
    DELETE_PLAY: '/deletePlay',

    // Scenarios
    CREATE_SCENARIO: '/createScenario',
    UPDATE_SCENARIO: '/updateScenario',
    GET_SCENARIO: '/getScenario',
    GET_SCENARIOS: '/getScenarios',
    DELETE_SCENARIO: '/deleteScenario'

});