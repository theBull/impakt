/// <reference path='./models.ts' />

module Playbook.Models {

	export class PreviewRouteControlPath
	extends Common.Models.RouteControlPath
    implements Common.Interfaces.IRouteControlPath {

		constructor(routeNode: Common.Models.RouteNode) {
			super(routeNode);
		}

		public draw(): void {
            // preview route curves do not have visible control paths
		}

	}

}