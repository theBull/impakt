/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	export interface IRouteNode
	extends Common.Interfaces.IFieldElement {
		node: Common.Models.LinkedListNode<Common.Interfaces.IRouteNode>;
		type: Common.Enums.RouteNodeTypes;
        routeAction: Common.Interfaces.IRouteAction;
        routeControlPath: Common.Interfaces.IRouteControlPath;
        player: Common.Interfaces.IPlayer;
	}
}