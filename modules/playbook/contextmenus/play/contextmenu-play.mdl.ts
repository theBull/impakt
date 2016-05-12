/// <reference path='../playbook-contextmenus.mdl.ts' />

impakt.playbook.contextmenus.play = 
angular.module('impakt.playbook.contextmenus.play', [])
.config(function() {
	console.debug('impakt.playbook.contextmenus.play - config');
})
.run(function() {
	console.debug('impakt.playbook.contextmenus.play - run');	
});