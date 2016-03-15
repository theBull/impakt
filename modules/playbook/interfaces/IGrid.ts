/// <reference path='./interfaces.ts' />

module Playbook.Interfaces {
	
	export interface IGrid {
		paper: Playbook.Interfaces.IPaper;
		size: number;
		cols: number;
		rows: number;
		width: number;
		height: number;
		divisor: number;

		draw(): void;
		resize(sizingMode: Playbook.Editor.PaperSizingModes): number;
		getSize(): number;
		getWidth(): number;
		getHeight(): number;
		getCenter(): Playbook.Models.Coordinate;
		getPixelsFromCoordinate(coord: number): number;
		getPixelsFromCoordinates(coords: Playbook.Models.Coordinate): Playbook.Models.Coordinate;
		getGridCoordinatesFromPixels(pixels: Playbook.Models.Coordinate): Playbook.Models.Coordinate;
		snapPixel(pixel: number): number;
		isDivisible(value: number): boolean;

	}
}