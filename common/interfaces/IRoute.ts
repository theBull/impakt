/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	
	export interface IRoute
	extends Common.Interfaces.IModifiable {

		player: Common.Interfaces.IPlayer;
		field: Common.Interfaces.IField;
		paper: Common.Interfaces.IPaper;
		grid: Common.Interfaces.IGrid;
        nodes: Common.Models.ModifiableLinkedList<Common.Interfaces.IRouteNode>;
        routePath: Common.Interfaces.IRoutePath;
        dragInitialized: boolean;

		draw(): void;
		initializeCurve(coords: Common.Models.Coordinates, flip?: boolean); 
		addNode(routeNode: Common.Interfaces.IRouteNode, render?: boolean)
			: Common.Models.LinkedListNode<Common.Models.RouteNode>;
		getMixedStringFromNodes(
			nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]
		): string;
		getPathStringFromNodes(
			initialize: boolean, 
			nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]
		): string;
		getCurveStringFromNodes(
			initialize: boolean, 
			nodeArray: Common.Models.LinkedListNode<Common.Models.RouteNode>[]
		): string;
	}
}