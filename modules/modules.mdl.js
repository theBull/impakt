/// <reference path='../js/impakt.ts' />
impakt.modules = angular.module('impakt.modules', [
    'impakt.playbook',
    'impakt.nav',
    'impakt.user',
    'impakt.search',
    'impakt.team'
])
    .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        console.debug('impakt.modules - config');
    }])
    .run(function () {
    console.debug('impakt.modules - run');
});
