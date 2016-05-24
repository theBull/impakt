/// <reference path='./interfaces.ts' />

module Common.Interfaces {
	
	export interface IRoute
	extends Common.Interfaces.IFieldElement {

		player: Common.Interfaces.IPlayer;
		field: Common.Interfaces.IField;
		layer: Common.Models.Layer;
		paper: Common.Interfaces.IPaper;
		grid: Common.Interfaces.IGrid;
        nodes: Common.Models.LinkedList<Common.Interfaces.IRouteNode>;
        routePath: Common.Interfaces.IRoutePath;
        dragInitialized: boolean;
        type: Common.Enums.RouteTypes;
        renderType: Common.Enums.RenderTypes;
        flipped: boolean;

		draw(): void;
		flip(): void;
		initializeCurve(coords: Common.Models.Coordinates, flip?: boolean); 
		addNode(routeNode: Common.Interfaces.IRouteNode, render?: boolean)
			: Common.Interfaces.IRouteNode;
		getMixedStringFromNodes(
			nodeArray: Common.Interfaces.IRouteNode[]
		): string;
		getPathStringFromNodes(
			initialize: boolean, 
			nodeArray: Common.Interfaces.IRouteNode[]
		): string;
		getCurveStringFromNodes(
			initialize: boolean, 
			nodeArray: Common.Interfaces.IRouteNode[]
		): string;
	}
}