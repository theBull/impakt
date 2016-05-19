/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IRouteAction
	extends Common.Interfaces.IFieldElement {
		routeNode: Common.Interfaces.IRouteNode;
		action: Common.Enums.RouteNodeActions;
	}
}