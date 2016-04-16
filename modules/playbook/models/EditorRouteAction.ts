/// <reference path='./models.ts' />

module Playbook.Models {
    
	export class EditorRouteAction
	extends Common.Models.RouteAction
    implements Common.Interfaces.IRouteAction {

		constructor(routeNode: Common.Models.RouteNode, action: Common.Enums.RouteNodeActions) {
			super(routeNode, action);

			this.layer.graphics.setOffsetXY(0.5, 0.5);
		}
	}
}