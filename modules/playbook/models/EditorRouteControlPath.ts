/// <reference path='./models.ts' />

module Playbook.Models {

    export class EditorRouteControlPath
    extends Common.Models.RouteControlPath
    implements Common.Interfaces.IRouteControlPath {

		constructor(routeNode: Common.Models.RouteNode) {
			super(routeNode);
		}
	}

}