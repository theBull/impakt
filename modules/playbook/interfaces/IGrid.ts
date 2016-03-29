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
		getCenter(): Playbook.Models.Coordinates;
		getAbsoluteFromCoordinate(val: number): number;
		getAbsoluteFromCoordinates(x: number, y: number): Playbook.Models.Coordinates;
		getCoordinatesFromAbsolute(ax: number, ay: number): Playbook.Models.Coordinates;
		snapPixel(pixel: number): number;
		isDivisible(value: number): boolean;

	}
}