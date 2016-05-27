/// <reference path='./league.mdl.ts' />
/**
 * League constants defined here
 */

impakt.league.constant('LEAGUE', {
    ENDPOINT: '/teamInfo',
    
    // League
    CREATE_LEAGUE: '/createLeague',
    GET_LEAGUES: '/getLeagues',
    GET_LEAGUE: '/getLeague',
    DELETE_LEAGUE: '/deleteLeague',

    // League Teams
    CREATE_TEAM: '/createTeam',
    GET_TEAMS: '/getTeams',
    GET_TEAM: '/getTeam',
    DELETE_TEAM: '/deleteTeam',

    // League Conferences
    CREATE_CONFERENCE: '/createConference',
    GET_CONFERENCES: '/getConferences',
    GET_CONFERENCE: '/getConference',
    DELETE_CONFERENCE: '/deleteConference',
    UPDATE_CONFERENCE: '/updateConference',

    // League Divisions
    CREATE_DIVISION: '/createDivision',
    GET_DIVISIONS: '/getDivisions',
    GET_DIVISION: '/getDivision',
    DELETE_DIVISION: '/deleteDivision',
    UPDATE_DIVISION: '/updateDivision'

});