/// <reference path='./home.mdl.ts' />

// Home service
impakt.home.service('_home',
[
'$state', '__nav',
function($state: any, __nav: any) {

    var self = this;
    this.menuItems = __nav.menuItems;


    /**
     * Navigation to other modules
     */

    this.toTeam = function() {
        $state.transitionTo('team');
    }

    this.toPlaybook = function() {
        $state.transitionTo('playbook');
    }

    this.toSeason = function() {
        $state.transitionTo('season');
    }

    this.toPlanning = function() {
        $state.transitionTo('planning');
    }

    this.toAnalysis = function() {
        $state.transitionTo('analysis');
    }

    this.toProfile = function() {
        $state.transitionTo('profile');
    }

}]);