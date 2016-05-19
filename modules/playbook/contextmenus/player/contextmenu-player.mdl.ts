/// <reference path='../playbook-contextmenus.mdl.ts' />

impakt.playbook.contextmenus.player = 
angular.module('impakt.playbook.contextmenus.player', [])
.config(function() {
	console.debug('impakt.playbook.contextmenus.player - config');
})
.run(function() {
	console.debug('impakt.playbook.contextmenus.player - run');	
});