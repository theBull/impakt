/// <reference path='../playbook.mdl.ts' />

impakt.playbook.contextmenus = angular.module(
'impakt.playbook.contextmenus', [
	'impakt.playbook.contextmenus.routeNode'
])
.config(function() {
	console.debug('impakt.playbook.contextmenus - config');
})
.run(function() {
	console.debug('impakt.playbook.contextmenus - run');
});