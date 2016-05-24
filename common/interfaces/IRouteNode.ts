/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IRouteNode
	extends Common.Interfaces.IFieldElement,
	Common.Interfaces.ILinkedListNode<Common.Interfaces.IRouteNode> {

		type: Common.Enums.RouteNodeTypes;
        routeAction: Common.Interfaces.IRouteAction;
        routeControlPath: Common.Interfaces.IRouteControlPath;
        route: Common.Interfaces.IRoute;
        flipped: boolean;

        flip(): void;
	}
}