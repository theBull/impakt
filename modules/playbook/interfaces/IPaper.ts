/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {
	
	export interface IPaper {
		canvas: Playbook.Interfaces.ICanvas;
		grid: Playbook.Interfaces.IGrid;
		field: Playbook.Interfaces.IField;
		Raphael: any;
		x: number;
		y: number;
		zoomSpeed: number;
		showBorder: boolean;
		viewOutline: any;
		sizingMode: Playbook.Editor.PaperSizingModes;

		draw(): void;
		updatePlay(playPrimary: Playbook.Models.PlayPrimary, playOpponent: Playbook.Models.PlayOpponent, redraw?: boolean): void;
		getWidth(): number;
		getHeight(): number;
		getXOffset(): number;
		drawOutline(): void;
		resize(): void;
		setViewBox(): void;
		zoom(deltaY: number): void;
		zoomToFit(): void;
		zoomIn(speed?: number): void;
		zoomOut(speed?: number): void;
		scroll(scrollToX: number, scrollToY: number): void;

		// raphael wrapper methods
		clear(): any;
		path(path: string): any;
		bump(x: number, y: number, raphael: any): any;
		alignToGrid(x: number, y: number, absolute: boolean): Playbook.Models.Coordinates;
		rect(x: number, y: number, width: number, height: number, absolute?: boolean): any;
		ellipse(x: number, y: number, width: number, height: number, absolute?: boolean);
		circle(x: number, y: number, radius: number, absolute?: boolean): any;
		text(x: number, y: number, text: string, absolute?: boolean): any;
		print(x: number, y: number, text: string, font: string,
			size?: number, origin?: string, letterSpacing?: number): any;
		getFont(family: string, weight?: string, style?: string, stretch?: string): any;
		set(): any;
		remove(element: any): any;
		pathMoveTo(ax: number, ay: number): string;
		getPathString(initialize: boolean, coords: number[]): string;
		pathLineTo(x, y): any;
		getPathStringFromNodes(
			initialize: boolean, nodeArray: Playbook.Models.FieldElement[]): string;
		getClosedPathString(...args: any[]): string;

		/**
		 *
		 * ---
		 * From the W3C SVG specification:
		 * Draws a quadratic Bézier curve from the current point to (x,y) 
		 * using (x1,y1) as the control point. 
		 * Q (uppercase) indicates that absolute coordinates will follow; 
		 * q (lowercase) indicates that relative coordinates will follow. 
		 * Multiple sets of coordinates may be specified to draw a polybézier. 
		 * At the end of the command, the new current point becomes 
		 * the final (x,y) coordinate pair used in the polybézier.
		 * ---
		 * 
		 * @param  {any[]}  ...args [description]
		 * @return {string}         [description]
		 */
		getCurveString(initialize: boolean, coords: number[]): string;
		quadraticCurveTo(x1, y1, x, y): string;
		getCurveStringFromNodes(initialize: boolean, nodeArray: Playbook.Models.FieldElement[]): string;
		buildPath(fromGrid: Playbook.Models.Coordinates, toGrid: Playbook.Models.Coordinates, width: number): string;
		distance(x1: number, y1: number, x2: number, y2: number): number;
		// returns radians
		theta(x1: number, y1: number, x2: number, y2: number): number;
		toDegrees(angle: number): number;
		toRadians(angle: number): number;
	}
}