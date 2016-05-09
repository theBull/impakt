/// <reference path='./home.mdl.ts' />

// Home service
impakt.home.service('_home',
[
'$state', '__nav',
function($state: any, __nav: any) {

    this.menuItems = __nav.menuItems;

}]);