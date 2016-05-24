/// <reference path='./contextmenu-routeNode.mdl.ts' />

impakt.playbook.contextmenus.routeNode.controller(
'impakt.playbook.contextmenus.routeNode.ctrl',[
'$scope', 
'_contextmenu',
function(
	$scope: any,
	_contextmenu: any
) {

	$scope.routeNode = <Common.Interfaces.IRouteNode>_contextmenu.getData();

}]);